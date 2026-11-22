const express=require("express");
const Product=require("../../models/products.js");
const User=require("../../models/user.js");
const Cart=require("../../models/carts.js");
const Order=require("../../models/orders.js");

const router=express.Router();
const stopWords=new Set(["the","and","for","with","from","this","that","what","which","where","how","price","product","products","available","availability","stock","buy","cart","add","please","mujhe","chahiye","kya","hai","hain","ka","ki","ke","ye","mein","me","ko","aur","se","batao","dikhao","kaise"]);
const synonyms={
 mobile:["mobile","phone","smartphone","electronics"],
 phone:["mobile","phone","smartphone","electronics"],
 kapde:["clothing","fashion","shirt","dress"],
 clothes:["clothing","fashion","shirt","dress"],
 shoe:["shoes","footwear","sneaker"],
 shoes:["shoe","footwear","sneaker"],
 sneaker:["sneakers","shoes","footwear"],
 sneakers:["sneaker","shoe","footwear"],
 laptop:["notebook","computer","electronics"],
 makeup:["makeup","beauty","cosmetics"],
 kirana:["groceries","grocery","food"],
 fruits:["fruit","fruits","produce"],
 vegetable:["vegetables","grocery","produce"],
 vegetables:["vegetable","grocery","produce"]
};
function words(value){
 const base=String(value||"").toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(token=>token.length>2&&!stopWords.has(token));
 const expanded=new Set(base);
 for(const token of base)for(const extra of synonyms[token]||[])expanded.add(extra);
 return [...expanded];
}
function isCustomer(req){return Boolean(req.user&&req.user.role==="customer");}
function publicProduct(product,reason){
 return {_id:String(product._id),name:product.name,price:product.price,stock:Number(product.stock??100),rating:Number(product.rating)||0,category:product.category||"Other",image:product.image?.url||"",reason};
}

// Persist meaningful storefront searches for signed-in customers; the capped
// list keeps activity useful without growing user records indefinitely.
router.post("/search",async(req,res,next)=>{
 try{
  const query=typeof req.body?.query==="string"?req.body.query.trim().replace(/\s+/g," ").slice(0,80):"";
  if(!isCustomer(req)||query.length<2||!words(query).length)return res.sendStatus(204);
  await User.updateOne({_id:req.user._id},{$push:{searchHistory:{$each:[{query,searchedAt:new Date()}],$position:0,$slice:25}}});
  res.sendStatus(204);
 }catch(error){next(error);}
});

router.get("/",async(req,res,next)=>{
 try{
  if(!isCustomer(req))return res.json({personalized:false,products:[]});
  res.set("Cache-Control","private, no-store");
  const [user,cart,orders,catalog]=await Promise.all([
   User.findById(req.user._id).select("searchHistory cartHistory").populate("cartHistory.product","name category description").lean(),
   Cart.findOne({user:req.user._id}).populate("items.product","name category description").lean(),
   Order.find({customer:req.user._id,status:{$ne:"cancelled"}}).select("products createdAt").sort({createdAt:-1}).limit(12).populate("products.product","name category description").lean(),
   Product.find({stock:{$gt:0}}).select("name price stock rating category description image").lean()
  ]);
  const cartLines=(cart?.items||[]).filter(line=>line.product);
  const bought=(orders||[]).flatMap(order=>(order.products||[]).map(line=>line.product).filter(Boolean));
  const excluded=new Set([...cartLines.map(line=>String(line.product._id)),...bought.map(product=>String(product._id))]);
  const searches=(user?.searchHistory||[]).slice(0,12);
  const signals=[];
  searches.forEach((entry,index)=>{const tokens=words(entry.query);if(tokens.length)signals.push({tokens,weight:Math.max(3,8-index*.45),kind:"search"});});
  (user?.cartHistory||[]).filter(entry=>entry.product).slice(0,20).forEach((entry,index)=>signals.push({tokens:words(entry.product.name),category:entry.product.category,weight:Math.max(2.5,7-index*.2),kind:"cart"}));
  cartLines.forEach(line=>signals.push({tokens:words(line.product.name),category:line.product.category,weight:8,kind:"cart"}));
  bought.slice(0,20).forEach(product=>signals.push({tokens:words(product.name),category:product.category,weight:5,kind:"order"}));
  if(!signals.length)return res.json({personalized:false,products:[]});
  const ranked=catalog.filter(product=>!excluded.has(String(product._id))).map(product=>{
   const nameTokens=new Set(words(product.name));
   const categoryTokens=new Set(words(product.category));
   const descriptionTokens=new Set(words(product.description));
   const productCategory=String(product.category||"").trim().toLowerCase();
   let score=0,reasonKind="search";
   for(const signal of signals){
    const nameHits=signal.tokens.filter(token=>nameTokens.has(token)).length;
    const categoryHits=signal.tokens.filter(token=>categoryTokens.has(token)).length;
    const exactCategory=signal.category&&String(signal.category).trim().toLowerCase()===productCategory;
    let signalScore=0;
    if(signal.kind==="search"){
     signalScore=signal.weight*(Math.min(nameHits,3)*1.8+Math.min(categoryHits,3)*2.4);
     // Description-only matches can help with specific searches, but do not
     // promote generic words that happen to occur in many product descriptions.
     const specificDescriptionHits=signal.tokens.filter(token=>token.length>=5&&descriptionTokens.has(token)).length;
     if(!nameHits&&!categoryHits&&specificDescriptionHits)signalScore=signal.weight*Math.min(specificDescriptionHits,2)*0.7;
    }else{
     signalScore=(exactCategory?signal.weight*2.8:0)+Math.min(nameHits,2)*signal.weight*1.5+Math.min(categoryHits,2)*signal.weight*1.2;
    }
    if(signalScore>score){score=signalScore;reasonKind=signal.kind;}
   }
   return {product,score,reasonKind};
  }).filter(item=>item.score>=4).sort((a,b)=>b.score-a.score||(b.product.rating||0)-(a.product.rating||0));
  const recommendations=ranked.slice(0,6).map(item=>publicProduct(item.product,item.reasonKind==="cart"?"Similar to items in your cart":item.reasonKind==="order"?"Based on a previous order":"Based on your recent searches"));
  res.json({personalized:recommendations.length>0,products:recommendations});
 }catch(error){next(error);}
});
module.exports=router;
