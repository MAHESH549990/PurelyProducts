const express=require("express");
const Product=require("../../models/products.js");

const router=express.Router();
const requestCounts=new Map();
const WINDOW_MS=60*60*1000;
const MAX_REQUESTS=30;
const stopWords=new Set(["is","it","the","a","an","this","that","for","of","in","on","to","and","or","do","does","i","me","my","you","your","how","what","where","can","please","product","available","availability","stock","hello","hi","hey","there","help","thanks","thank","you","are","hai","hain","kya","ka","ki","ke","ye","yah","woh","wo","mujhe","chahiye","batao","btao","dikhao","karo","kaise","karu","kare","mein","me","ko","aur","se","par","milega","milta","milti"]);
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
 const greeting=/\b(hi|hello|hey|namaste|namaskar|good morning|good afternoon|good evening)\b|नमस्ते|नमस्कार|हेलो|हाय/u.test(text);
 const thanks=/\b(thanks|thank you|thankyou|thx)\b|धन्यवाद|शुक्रिया/u.test(text);
 const identity=/\b(who are you|what are you|your name|what can you do)\b|आप कौन|तुम कौन|आप क्या कर/u.test(text);
 const payment=/payment|pay|card|पेमेंट|भुगतान|पैसे/u.test(text);
 const discountQuestion=/discount|offer|deal|छूट|ऑफर|रियायत/u.test(text);
 const deliveryFee=/delivery charge|delivery fee|shipping|डिलीवरी चार्ज|डिलीवरी फीस|शिपिंग/u.test(text);
 const deliveryStatus=/delivery status|track.*order|where.*order|my order|डिलीवरी.*स्टेटस|ऑर्डर.*कहाँ|ऑर्डर.*कहां|ऑर्डर.*ट्रैक/u.test(text);
 const availability=/available|availability|in stock|stock|उपलब्ध|स्टॉक|मिलेगा|मिलेगी/u.test(text);
 const shoppingHelp=/cart|checkout|buy|purchase|order|bag|कार्ट|खरीद|चेक.?आउट|ऑर्डर|आदेश|जोड़/u.test(text);
 if(products.length)return productSummary(products,lang)+(discountQuestion?(lang==="hi"?"\n\nएक ऑर्डर में 2 या अधिक items पर product subtotal पर 5% छूट मिलती है।":"\n\nGet 5% off the product subtotal when one order contains 2 or more items."):(shoppingHelp?(lang==="hi"?"\n\nखरीदने के लिए: प्रोडक्ट खोलें और “Add to bag” दबाएँ। फिर Cart से पता चुनकर “Place order” करें।":"\n\nTo buy, open a product and choose “Add to bag.” Then open Cart, select your address, and choose “Place order.”"):""));
 if(greeting)return lang==="hi"?"नमस्ते! 😊 मैं PurelyProducts का शॉपिंग सहायक हूँ। मैं प्रोडक्ट का लाइव स्टॉक देख सकता हूँ और कार्ट या checkout में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?":"Hi there! 😊 I’m the PurelyProducts shopping helper. I can check live product stock and help with your cart or checkout. What would you like to know?";
 if(thanks)return lang==="hi"?"आपका स्वागत है! 😊 प्रोडक्ट या खरीदारी से जुड़ा कोई और सवाल हो तो पूछें।":"You’re welcome! 😊 Feel free to ask me another product or shopping question.";
 if(identity)return lang==="hi"?"मैं PurelyProducts का शॉपिंग सहायक हूँ। मैं कैटलॉग में प्रोडक्ट और स्टॉक देख सकता हूँ और खरीदारी के चरण समझा सकता हूँ।":"I’m the PurelyProducts shopping helper. I can look up products and stock in the catalogue and explain how to shop.";
 if(payment)return lang==="hi"?"Checkout पर अभी demo payment form है। यह केवल प्रदर्शन के लिए है और असली कार्ड से पैसे नहीं काटता। ऑर्डर पूरा करने के लिए कार्डधारक का नाम दर्ज करें।":"Checkout currently uses a demo payment form. It is for demonstration only and does not charge a real card. Enter a cardholder name to complete the demo order.";
 if(discountQuestion)return lang==="hi"?"एक ऑर्डर में 2 या अधिक items पर product subtotal पर 5% छूट मिलती है।":"Get 5% off the product subtotal when one order contains 2 or more items.";
 if(deliveryFee)return lang==="hi"?"₹299 से कम product subtotal पर ₹35 delivery charge लगता है। ₹299 या उससे अधिक पर delivery free है।":"A ₹35 delivery charge applies when the product subtotal is below ₹299. Delivery is free at ₹299 or above.";
 if(deliveryStatus)return lang==="hi"?"अपने ऑर्डर और delivery updates देखने के लिए साइन इन करके Profile के Orders पेज पर जाएँ। ऑर्डर की स्थिति वहीं दिखाई देती है।":"Sign in and open Orders from your profile to see your order status and delivery updates.";
 if(availability)return lang==="hi"?"किस प्रोडक्ट की उपलब्धता जाननी है? उसका नाम या कैटेगरी लिखें, मैं लाइव स्टॉक देखूँगा।":"Which product should I check? Send its name or category and I’ll look up live stock.";
 if(shoppingHelp)return lang==="hi"
  ?"खरीदने के लिए: प्रोडक्ट खोलें और “Add to bag” दबाएँ। फिर “Cart” में जाएँ, पता चुनें और “Place order” दबाकर चेकआउट पूरा करें। कार्ट और ऑर्डर के लिए साइन इन करना ज़रूरी है।"
  :"To buy: open a product and choose “Add to bag.” Then open Cart, choose your address, and select “Place order” to continue checkout. Sign in to use your cart and place an order.";
 if(lang==="hi")return "मैं सामान्य बातचीत कर सकता हूँ और PurelyProducts की खरीदारी में मदद कर सकता हूँ। प्रोडक्ट, स्टॉक, कार्ट, checkout, payment या delivery के बारे में पूछें।";
 return "I can chat and help you shop on PurelyProducts. Ask me about products, stock, cart, checkout, payment, or delivery.";
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
    "Use only the catalog facts below for product names, price, and availability. Never claim a product is in stock unless stock is greater than zero. Only say no product match was found if the customer actually asked about a product and none matched. Respond naturally to greetings, thanks, and general conversation.",
    "Explain how to open a product, add it to the bag, open the cart, choose an address, and place an order. Adding to cart and checkout require signing in. Never claim you completed an action or placed an order.",
    "A single order with 2 or more item units receives 5% off the product subtotal. Checkout uses a simulated demo payment and does not charge real cards. A ₹35 delivery charge applies below a ₹299 product subtotal before discount; delivery is free at ₹299 or above. Do not invent return policies or delivery dates.",
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
