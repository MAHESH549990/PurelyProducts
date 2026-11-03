import React from 'react';
import {id,image} from './ui';

export default function ReviewsList({reviews=[],user,productId,submit}) {
 if(!reviews.length)return <div className="review-empty">No reviews yet. Your experience can be the first.</div>;
 return <section className="reviews-list" aria-label="Customer reviews">{reviews.map(review=><article className="review-card" key={id(review)}>
  <div className="review-topline"><span className="review-stars" aria-label={`${review.rating||5} out of 5 stars`}>{'★'.repeat(Math.max(1,Math.min(5,Number(review.rating)||5)))}<span>{'★'.repeat(5-Math.max(1,Math.min(5,Number(review.rating)||5)))}</span></span><span className="review-rating">{Number(review.rating||5).toFixed(1)} / 5</span></div>
  <div className="review-byline"><b>{review.owner?.username||'Customer'}</b><time>{review.createdAt?new Date(review.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'Verified buyer'}</time></div>
  <p className="review-comment">{review.comment}</p>
  {image(review)&&<img className="review-photo" src={image(review)} alt="Photo shared with this review"/>}
  {(user?.role==='admin'||String(review.owner?._id||review.owner)===String(user?._id))&&<form className="review-delete-form" action={`/users/${productId}/reviews/${id(review)}`} data-method="DELETE" onSubmit={submit}><button type="submit" className="review-delete">Delete review</button></form>}
 </article>)}</section>;
}
