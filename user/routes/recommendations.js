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
 makeup:["makeup","beauty","cosmetics"],
 kirana:["groceries","grocery","food"],
 fruits:["fruit","fruits","produce"]
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
  if(!isCustomer(req)||query.length<2)return res.sendStatus(204);
  await User.updateOne({_id:req.user._id},{$push:{searchHistory:{$each:[{query,searchedAt:new Date()}],$position:0,$slice:25}}});
  res.sendStatus(204);
 }catch(error){next(error);}
});

router.get("/",async(req,res,next)=>{
 try{
  if(!isCustomer(req))return res.json({personalized:false,products:[]});
  const [user,cart,orders,catalog]=await Promise.all([
   User.findById(req.user._id).select("searchHistory cartHistory").populate("cartHistory.product","name category description").lean(),
   Cart.findOne({user:req.user._id}).populate("items.product","name category description").lean(),
   Order.find({customer:req.user._id,status:{$ne:"cancelled"}}).select("products createdAt").sort({createdAt:-1}).limit(25).populate("products.product","name category description").lean(),
   Product.find({stock:{$gt:0}}).select("name price stock rating category description image").lean()
  ]);
  const cartLines=(cart?.items||[]).filter(line=>line.product);
  const bought=(orders||[]).flatMap(order=>(order.products||[]).map(line=>line.product).filter(Boolean));
  const excluded=new Set([...cartLines.map(line=>String(line.product._id)),...bought.map(product=>String(product._id))]);
  const searches=(user?.searchHistory||[]).slice(0,15);
  const signals=[];
  searches.forEach((entry,index)=>signals.push({tokens:words(entry.query),weight:Math.max(2,7-index*.35),kind:"search"}));
  (user?.cartHistory||[]).filter(entry=>entry.product).slice(0,30).forEach((entry,index)=>signals.push({tokens:words(entry.product.name+" "+entry.product.category),category:entry.product.category,weight:Math.max(2,6-index*.12),kind:"cart"}));
  cartLines.forEach(line=>signals.push({tokens:words(line.product.name+" "+line.product.category),category:line.product.category,weight:7,kind:"cart"}));
  bought.slice(0,30).forEach(product=>signals.push({tokens:words(product.name+" "+product.category),category:product.category,weight:4,kind:"order"}));
  const ranked=catalog.filter(product=>!excluded.has(String(product._id))).map(product=>{
   const text=(product.name+" "+product.category+" "+product.description).toLowerCase();
   let score=0,reasonKind="search";
   for(const signal of signals){
    let signalScore=signal.category&&signal.category===product.category?signal.weight*1.7:0;
    for(const token of signal.tokens)if(text.includes(token))signalScore+=signal.weight*(String(product.name).toLowerCase().includes(token)?1.5:1);
    if(signalScore>score){score=signalScore;reasonKind=signal.kind;}
   }
   return {product,score,reasonKind};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||(b.product.rating||0)-(a.product.rating||0));
  let personalized=ranked.length>0;
  let recommendations=ranked.slice(0,6).map(item=>publicProduct(item.product,item.reasonKind==="cart"?"Similar to items in your cart":item.reasonKind==="order"?"Based on a previous order":"Based on your recent searches"));
  if(!recommendations.length){
   recommendations=[...catalog].sort((a,b)=>(Number(b.rating)||0)-(Number(a.rating)||0)).filter(product=>!excluded.has(String(product._id))).slice(0,6).map(product=>publicProduct(product,"Popular pick"));
  }
  res.json({personalized,products:recommendations});
 }catch(error){next(error);}
});
module.exports=router;
