import React from 'react';
import {id,image,money,Field,Empty} from './ui';
import ReviewsList from './ReviewsList';

export default function ProductDetails({item,canReview=false,submit,user}) {
 if(!item)return <main className="section"><Empty title="Product not found" copy="It may have moved or been removed." link="/product"/></main>;

 const stock=Number(item.stock??100);
 const reviewCount=item.reviews?.length||0;

 return <main className="detail detail-modern">
  <section className="detail-visual">
   <a className="back" href="/product">← Back to the collection</a>
   <div className="detail-photo detail-photo-modern">
    {image(item)?<img src={image(item)} alt={item.name}/>:<span>PURELY PICKED</span>}
    <span className="detail-image-tag">{item.category||'CURATED FOR YOU'}</span>
   </div>
  </section>

  <section className="detail-info">
   <div className="detail-eyebrow">A GOOD THING, CHOSEN FOR YOU</div>
   <h1>{item.name}</h1>
   <a className="detail-rating" href="#reviews"><span aria-hidden="true">★</span><b>{Number(item.rating||0).toFixed(1)}</b><i>·</i><span>{reviewCount} {reviewCount===1?'review':'reviews'}</span></a>
   <div className="detail-price-row"><b className="detail-price">{money(item.price)}</b><span>Inclusive of all taxes</span></div>
   <p className="detail-description">{item.description}</p>

   <div className={`detail-stock-pill ${stock>0?'is-available':'is-sold-out'}`}>
    <span aria-hidden="true"/>{stock>0?`In stock · ${stock} available`:'Currently out of stock'}
   </div>

   <div className="detail-purchase-card">
    <form action={`/product/${id(item)}/cart`} method="post" onSubmit={submit} className="buy-form buy-form-modern">
     <Field label="QUANTITY" name="quantity" type="number" defaultValue="1" min="1" max={stock||1}/>
     <button className="btn primary" disabled={stock<1}>{stock>0?<>Add to bag <b>↗</b></>:'Out of stock'}</button>
    </form>
    <div className="detail-purchase-note"><span>✓</span> Checkout securely · Easy order tracking</div>
   </div>

   <div className="detail-promises"><span><b>✦</b> Thoughtfully selected</span><span><b>↗</b> Delivered to your door</span></div>
  </section>

  <section className="product-reviews detail-reviews" id="reviews">
   <div className="reviews-heading"><div><small>FROM OUR COMMUNITY</small><h2>Customer reviews</h2><p>What shoppers are saying about this item.</p></div><span>{reviewCount} {reviewCount===1?'review':'reviews'}</span></div>
   <ReviewsList reviews={item.reviews||[]} user={user} productId={id(item)} submit={submit}/>
  </section>

  {canReview&&<form action={`/users/${id(item)}/reviews`} method="post" encType="multipart/form-data" onSubmit={submit} className="panel form-stack review-form detail-review-form">
   <div><small>VERIFIED PURCHASE</small><h3>Share your experience</h3><p>Your feedback helps other shoppers choose with confidence.</p></div>
   <Field label="Rating (1–5)" name="review[rating]" type="number" defaultValue="5" min="1" max="5"/>
   <Field label="Your review" name="review[comment]" required/>
   <Field label="Photo (optional)" name="image" type="file"/>
   <button className="btn primary">Submit review <b>↗</b></button>
  </form>}
 </main>;
}
