import React,{useEffect,useRef,useState} from 'react';
import {money} from '../pages/ui';

const copy={
 en:{title:'Purely helper',subtitle:'Ask about products or shopping',welcome:'Hi! I can check product availability and help you shop. What are you looking for?',placeholder:'Ask about a product…',send:'Send',open:'Open chat',close:'Close chat',english:'English',hindi:'हिन्दी',prompts:['Is this product in stock?','How do I add to cart?','How do I checkout?'],view:'View product ↗',available:'In stock',sold:'Out of stock',busy:'Checking the catalog…',error:'I couldn’t reach the catalog. Please try again.',privacy:'Please don’t share passwords, payment details, or your address.'},
 hi:{title:'Purely सहायक',subtitle:'प्रोडक्ट या खरीदारी के बारे में पूछें',welcome:'नमस्ते! मैं प्रोडक्ट की उपलब्धता देख सकता हूँ और खरीदारी में मदद कर सकता हूँ। आप क्या ढूँढ रहे हैं?',placeholder:'प्रोडक्ट के बारे में पूछें…',send:'भेजें',open:'चैट खोलें',close:'चैट बंद करें',english:'English',hindi:'हिन्दी',prompts:['क्या यह प्रोडक्ट उपलब्ध है?','कार्ट में कैसे जोड़ें?','चेकआउट कैसे करें?'],view:'प्रोडक्ट देखें ↗',available:'स्टॉक में',sold:'स्टॉक में नहीं',busy:'कैटलॉग देख रहे हैं…',error:'कैटलॉग से कनेक्ट नहीं हो पाया। फिर कोशिश करें.',privacy:'पासवर्ड, पेमेंट जानकारी या अपना पता साझा न करें।'}
};
export default function ShopAssistant(){
 const [open,setOpen]=useState(false),[language,setLanguage]=useState('en'),[input,setInput]=useState(''),[busy,setBusy]=useState(false);
 const [messages,setMessages]=useState([{role:'assistant',text:copy.en.welcome,products:[]}]);
 const bottom=useRef(null),inputRef=useRef(null),t=copy[language];
 useEffect(()=>{bottom.current?.scrollIntoView({behavior:'smooth',block:'end'});},[messages,busy,open]);
 async function send(value){
  const message=(value===undefined?input:value).trim();if(!message||busy)return;
  const detected=/[\u0900-\u097F]/.test(message)||/\b(hai|hain|kya|kaise|mujhe|chahiye|batao|dikhao|karu|karo|mera|meri|mere|kitna|kahan|kab|iska|liye|milta|milega)\b/i.test(message)?'hi':language;
  setLanguage(detected);setInput('');setMessages(current=>[...current,{role:'user',text:message}]);setBusy(true);
  try{
   const response=await fetch('/api/chat',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({message,language:detected})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||copy[detected].error);
   setMessages(current=>[...current,{role:'assistant',text:data.answer||copy[detected].error,products:data.products||[]}]);
  }catch(error){setMessages(current=>[...current,{role:'assistant',text:error.message||copy[detected].error,products:[]}]);}
  finally{setBusy(false);setTimeout(()=>inputRef.current?.focus(),80);}
 }
 function changeLanguage(next){setLanguage(next);if(messages.length===1)setMessages([{role:'assistant',text:copy[next].welcome,products:[]}]);}
 return <div className="shop-assistant">
  {open&&<section className="shop-chat-panel" aria-label={t.title}>
   <header className="shop-chat-header"><div className="shop-chat-brand"><span>✳</span><div><b>{t.title}</b><small>{t.subtitle}</small></div></div><div className="shop-chat-controls"><button className={language==='en'?'selected':''} onClick={()=>changeLanguage('en')}>{t.english}</button><button className={language==='hi'?'selected':''} onClick={()=>changeLanguage('hi')}>{t.hindi}</button><button className="shop-chat-close" aria-label={t.close} onClick={()=>setOpen(false)}>×</button></div></header>
   <div className="shop-chat-messages" aria-live="polite"><div className="shop-chat-date">PURELYPRODUCTS · SHOPPING ASSISTANT</div>
    {messages.map((item,index)=><article className={'shop-chat-message '+item.role} key={index}><div className="shop-chat-bubble">{item.text}{item.products?.length>0&&<div className="shop-chat-products">{item.products.map(product=><div className="shop-chat-product" key={product._id}>{product.image?<img src={product.image} alt=""/>:<span className="shop-chat-product-placeholder">PP</span>}<div><b>{product.name}</b><small>{money(product.price)} · {product.stock>0?t.available+' · '+product.stock:t.sold}</small><a href={'/product/'+product._id}>{t.view}</a></div></div>)}</div>}</div></article>)}
    {busy&&<div className="shop-chat-message assistant"><div className="shop-chat-bubble shop-chat-typing">{t.busy}<span>•••</span></div></div>}
    {messages.length<3&&<div className="shop-chat-suggestions">{t.prompts.map(prompt=><button key={prompt} onClick={()=>send(prompt)}>{prompt}</button>)}</div>}<div ref={bottom}/>
   </div>
   <form className="shop-chat-form" onSubmit={event=>{event.preventDefault();send();}}><input ref={inputRef} value={input} onChange={event=>setInput(event.target.value)} maxLength={500} placeholder={t.placeholder} aria-label={t.placeholder}/><button disabled={!input.trim()||busy}>{t.send}<span>↗</span></button></form>
   <footer className="shop-chat-footer"><a href="/product/cart">Cart</a><span>{t.privacy}</span></footer>
  </section>}
  <button className={'shop-chat-launcher'+(open?' is-open':'')} onClick={()=>setOpen(value=>!value)} aria-label={open?t.close:t.open}>{open?<span>×</span>:<><span className="shop-chat-launcher-icon">✳</span><span className="shop-chat-launcher-copy"><b>Need a hand?</b><small>Chat with us · हिंदी / English</small></span><span className="shop-chat-launcher-arrow">↗</span></>}</button>
 </div>;
}
