const express=require("express");
const Product=require("../../models/products.js");

const router=express.Router();
const requestCounts=new Map();
const WINDOW_MS=60*60*1000;
const MAX_REQUESTS=30;
const stopWords=new Set(["is","it","the","a","an","this","that","for","of","in","on","to","and","or","do","does","i","me","my","you","your","how","what","where","can","please","product","available","availability","stock","hai","hain","kya","ka","ki","ke","ye","yah","woh","wo","mujhe","chahiye","batao","btao","dikhao","karo","kaise","karu","kare","mein","me","ko","aur","se","par","milega","milta","milti"]);
const synonyms={
 grocery:["grocery","groceries","kirana"],
 fashion:["fashion","clothes","clothing","kapde","dress","shirt","wear"],
 electronics:["electronics","mobile","phone","earphone","headphone"],
 beauty:["beauty","skincare","skin","cosmetic","makeup"],
 home:["home","kitchen","ghar","furniture","decor","utensil"],
 fruit:["fruit","fruits","phal"]
};
const tokenize=value=>String(value||"").toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(word=>word.length>1&&!stopWords.has(word));
function rankProducts(products,message){
 const words=tokenize(message),expanded=new Set(words);
 for(const [key,terms] of Object.entries(synonyms))if(terms.some(term=>words.includes(term)))terms.forEach(term=>expanded.add(term));
 if(!expanded.size)return [];
 return products.map(product=>{
  const name=String(product.name||"").toLowerCase(),category=String(product.category||"").toLowerCase(),description=String(product.description||"").toLowerCase();
  let score=0;for(const word of expanded){if(name.includes(word))score+=5;if(category.includes(word))score+=3;if(description.includes(word))score+=1;}
  return {product,score};
 }).filter(match=>match.score>0).sort((a,b)=>b.score-a.score).slice(0,6).map(match=>match.product);
}
function detectLanguage(message,requested){
 if(/[\u0900-\u097F]/.test(message))return "hi";
 if(requested==="hi"||requested==="en")return requested;
 return /\b(hai|hain|kya|kaise|mujhe|chahiye|batao|dikhao|karu|karo|mera|meri|mere|kitna|kahan|kab|iska|liye|milta|milega)\b/i.test(message)?"hi":"en";
}
function productSummary(products,lang){
 if(!products.length)return lang==="hi"?"इस सवाल से मेल खाने वाला कोई प्रोडक्ट नहीं मिला। प्रोडक्ट का नाम या कैटेगरी लिखकर देखें।":"I couldn’t find a matching product. Try its name or category.";
 return products.map(product=>{
  const stock=Number(product.stock??100);
  return lang==="hi"?"• "+product.name+" — "+(stock>0?"उपलब्ध ("+stock+" पीस)":"अभी स्टॉक में नहीं")+", कीमत ₹"+product.price+".":"• "+product.name+" — "+(stock>0?"In stock ("+stock+" available)":"Currently out of stock")+", ₹"+product.price+".";
 }).join("\n");
}
function fallbackAnswer(message,products,lang){
 const text=message.toLowerCase();
 const shoppingHelp=/cart|checkout|buy|purchase|order|bag|कार्ट|खरीद|चेक.?आउट|ऑर्डर|आदेश|जोड़/u.test(text);
 if(products.length)return productSummary(products,lang)+(shoppingHelp?(lang==="hi"?"\n\nखरीदने के लिए: प्रोडक्ट खोलें और “Add to bag” दबाएँ। फिर Cart से पता चुनकर “Place order” करें।":"\n\nTo buy, open a product and choose “Add to bag.” Then open Cart, select your address, and choose “Place order.”"):"");
 if(shoppingHelp)return lang==="hi"
  ?"खरीदने के लिए: प्रोडक्ट खोलें और “Add to bag” दबाएँ। फिर “Cart” में जाएँ, पता चुनें और “Place order” दबाकर चेकआउट पूरा करें। कार्ट और ऑर्डर के लिए साइन इन करना ज़रूरी है।"
  :"To buy: open a product and choose “Add to bag.” Then open Cart, choose your address, and select “Place order” to continue checkout. Sign in to use your cart and place an order.";
 return lang==="hi"?"मैं उपलब्धता और स्टॉक देखने के लिए प्रोडक्ट का नाम या कैटेगरी पूछ सकता हूँ। खरीदने के लिए प्रोडक्ट खोलें, “Add to bag” चुनें, फिर Cart से checkout करें।":"Ask me about a product name or category and I’ll check its live stock. To buy, open the product, select “Add to bag,” then check out from Cart.";
}
function rateLimit(req,res,next){
 const now=Date.now(),key=req.ip||req.socket.remoteAddress||"unknown",entry=requestCounts.get(key);
 if(!entry||now-entry.start>WINDOW_MS){requestCounts.set(key,{start:now,count:1});return next();}
 if(entry.count>=MAX_REQUESTS)return res.status(429).json({error:"Chat limit reached. Please try again in an hour."});
 entry.count++;next();
}
function cleanResponseText(payload){return payload?.candidates?.[0]?.content?.parts?.map(part=>part.text||"").join("").trim()||"";}

router.post("/",rateLimit,async(req,res)=>{
 try{
  const message=typeof req.body?.message==="string"?req.body.message.trim():"";
  if(!message||message.length>500)return res.status(400).json({error:"Please enter a question under 500 characters."});
  const language=detectLanguage(message,req.body?.language);
  const inventory=await Product.find({}).select("name price stock category description image").limit(250).lean();
  const matches=rankProducts(inventory,message);
  const products=matches.map(product=>({_id:String(product._id),name:product.name,price:product.price,stock:Number(product.stock??100),category:product.category||"Other",image:product.image?.url||""}));
  let answer="";
  const apiKey=process.env.GEMINI_API_KEY;
  if(apiKey){
   const languageName=language==="hi"?"Hindi":"English";
   const catalog=products.map(({_id,name,price,stock,category})=>({_id,name,price,stock,category}));
   const prompt=[
    "You are PurelyProducts' concise and friendly shopping assistant.",
    "Answer in "+languageName+".",
    "Use only the catalog facts below for product names, price, and availability. Never claim a product is in stock unless stock is greater than zero. If no catalog match exists, say so and ask what name or category to search.",
    "Explain how to open a product, add it to the bag, open the cart, choose an address, and place an order. Adding to cart and checkout require signing in. Never claim you completed an action or placed an order.",
    "Do not ask for passwords, card numbers, addresses, or other private information. Keep the response concise.",
    "Catalog matches from the live database: "+JSON.stringify(catalog),
    "Customer question: "+message
   ].join("\n");
   try{
    const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.25,maxOutputTokens:240}})});
    if(response.ok)answer=cleanResponseText(await response.json());else console.error("Gemini chat API returned",response.status);
   }catch(error){console.error("Gemini chat request failed:",error.message);}
  }
  if(!answer)answer=fallbackAnswer(message,products,language);
  res.json({answer,language,products,aiEnabled:Boolean(apiKey)});
 }catch(error){console.error("Shop assistant error:",error);res.status(500).json({error:"I couldn’t check the catalog right now. Please try again."});}
});
module.exports=router;
