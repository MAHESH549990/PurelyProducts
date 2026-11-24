import React,{useEffect,useMemo,useState} from 'react';
import {id,image,money,Empty} from './ui';

const categoryTerms={'Groceries':['grocery','vegetable','food','snack','rice','flour','oil'],'Premium Fruits':['fruit','apple','mango','berry','orange','grape'],'Home & Kitchen':['home','kitchen','furniture','chair','sofa','cookware','decor'],'Fashion':['fashion','clothing','shirt','dress','shoe','wear','accessory','bag'],'Electronics':['electronic','phone','mobile','laptop','computer','headphone','watch','camera'],'Beauty':['beauty','cosmetic','skincare','makeup','cream','perfume'],'Home Improvement':['tool','hardware','garden','light','storage','repair'],'Sports, Toys & Luggage':['sport','toy','luggage','travel','fitness','game']};

export default function Storefront({products=[],selectedCategory='All',onCategory=()=>{},user,submit}) {
 const [query,setQuery]=useState(''),[sort,setSort]=useState('Featured'),[recommendationData,setRecommendationData]=useState(null);
 async function loadRecommendations(){try{const response=await fetch('/api/recommendations',{credentials:'same-origin'});if(response.ok)setRecommendationData(await response.json());}catch{}}
 useEffect(()=>{if(user?.role!=='customer'){setRecommendationData(null);return;}loadRecommendations();},[user?._id,user?.role]);
 useEffect(()=>{
  const search=query.trim();if(user?.role!=='customer'||search.length<2)return;
  const timer=setTimeout(async()=>{try{await fetch('/api/recommendations/search',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({query:search})});await loadRecommendations();}catch{}},650);
  return ()=>clearTimeout(timer);
 },[query,user?._id,user?.role]);
 const shown=useMemo(()=>{
  const term=query.trim().toLowerCase();
  const filtered=products.filter(product=>{
   const text=`${product.name||''} ${product.description||''} ${product.category||''}`.toLowerCase();
   const categoryMatch=!selectedCategory||selectedCategory==='All'||(categoryTerms[selectedCategory]||[selectedCategory.toLowerCase()]).some(word=>text.includes(word));
   const stock=Number(product.stock??100);
   return (!term||text.includes(term))&&categoryMatch;
  });
  if(sort==='Price: low to high')filtered.sort((a,b)=>Number(a.price)-Number(b.price));
  if(sort==='Price: high to low')filtered.sort((a,b)=>Number(b.price)-Number(a.price));
  if(sort==='Top rated')filtered.sort((a,b)=>Number(b.rating||0)-Number(a.rating||0));
  return filtered;
 },[products,query,selectedCategory,sort]);
 const resetFilters=()=>{setQuery('');setSort('Featured');onCategory('All');};
 return <main className="store-page customer-storefront">
  <section className="hero"><div className="hero-copy"><small>GOOD FINDS FOR EVERYDAY LIVING</small><h1>SMART PICKS.</h1><p>Everyday essentials, thoughtful finds<br/>and deals worth discovering.</p><a className="btn primary" href="#collection">Shop the collection <b>↗</b></a><div className="hero-dots" aria-hidden="true">● ● ● ● ● ●</div></div><div className="hero-image"><div className="hero-img-a"/><div className="hero-img-b"/><span>MADE FOR<br/>EVERYDAY</span><small>PURELYPRODUCTS · TODAY’S PICKS</small></div></section>
  {user?.role==='customer'&&recommendationData?.personalized&&recommendationData.products?.length>0&&<section className="section recommendation-section"><div className="section-head"><div><small>PERSONALIZED FOR YOU</small><h2>Picked for you</h2></div><span>Based on your searches, cart, and orders</span></div><div className="products recommendation-grid">{recommendationData.products.map(product=><article className="product recommendation-product" key={id(product)}><a className="product-image" href={'/product/'+id(product)}>{image(product)?<img src={image(product)} alt={product.name}/>:<div className="placeholder p0">PURELY<br/>PICKED</div>}<small className="recommendation-tag">✳ {product.reason}</small></a><div className="product-row"><div><small>{product.category}</small><a href={'/product/'+id(product)}>{product.name}</a></div><span>★ {Number(product.rating||0).toFixed(1)}</span></div><div className="product-price"><b>{money(product.price)}</b><a className="recommendation-explore" href={'/product/'+id(product)}>Explore ↗</a></div></article>)}</div></section>}
  <section className="section product-section" id="collection">
   <div className="section-head"><div><small>THE COLLECTION</small><h2>Find something <a>good.</a></h2><p>Browse the collection and make it yours.</p></div><span className="store-results-count">{shown.length} {shown.length===1?'item':'items'}</span></div>
   <div className="catalog-tools catalog-tools-modern">
    <label className="catalog-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search products or categories" aria-label="Search products or categories"/>{query&&<button type="button" onClick={()=>setQuery('')} aria-label="Clear search">×</button>}</label>
    <label className="catalog-sort"><span>Sort</span><select value={sort} onChange={event=>setSort(event.target.value)} aria-label="Sort products"><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option><option>Top rated</option></select></label>
   </div>
   {shown.length?<div className="products">{shown.map((product,index)=>{const stock=Number(product.stock??100);return <article className="product" key={id(product)}><a className="product-image" href={`/product/${id(product)}`}>{image(product)?<img src={image(product)} alt={product.name}/>:<div className={`placeholder p${index%4}`}>PURELY<br/>PICKED</div>}<small className={`store-stock-tag ${stock>0?'available':'sold-out'}`}>{stock>0?'In stock':'Sold out'}</small></a><div className="product-row"><div><small>{product.category||'Everyday picks'}</small><a href={`/product/${id(product)}`}>{product.name}</a></div><span>★ {Number(product.rating||5).toFixed(1)}</span></div><div className="product-price"><b>{money(product.price)}</b><form action={`/product/${id(product)}/cart`} method="post" onSubmit={submit}><input type="hidden" name="quantity" value="1"/><button aria-label={`Add ${product.name} to bag`} disabled={stock<1}>{stock>0?'＋':'—'}</button></form></div></article>})}</div>:<div className="store-empty-results"><span>NO MATCHES THIS TIME</span><h3>Try another search or category.</h3><p>Clear your filters to see the full collection.</p><button type="button" className="btn outline" onClick={resetFilters}>Clear filters</button></div>}
  </section>

  <section className="section deals-section"><div className="section-head"><div><small>CURATED COLLECTIONS</small><h2>Shop by <a>mood</a></h2></div><span>Quick paths to the things you love</span></div><div className="deal-banners">{[['At home','Comforts for your space','Home & Kitchen'],['Tech picks','Everyday devices, thoughtfully chosen','Electronics'],['A little self-care','Find your everyday ritual','Beauty']].map(([eyebrow,heading,category],index)=><button type="button" className={`deal deal-${index}`} key={heading} onClick={()=>{onCategory(category);document.getElementById('collection')?.scrollIntoView({behavior:'smooth'})}}><small>{eyebrow}</small><b>{heading}</b><span>Explore collection ↗</span></button>)}</div></section>
  <section className="section essentials-section"><div className="section-head"><div><small>QUICK DISCOVERY</small><h2>Everyday <a>favourites</a></h2></div><button type="button" className="view-all" onClick={()=>{onCategory('All');document.getElementById('collection')?.scrollIntoView({behavior:'smooth'})}}>View collection ↗</button></div><div className="essentials">{products.filter(product=>Number(product.stock??100)>0).slice(0,6).map(product=><a href={`/product/${id(product)}`} key={id(product)}><span>{image(product)?<img src={image(product)} alt="" loading="lazy"/>:<b>✳</b>}</span><small>{product.name}</small><b>{money(product.price)}</b></a>)}</div></section>
 </main>;
}
