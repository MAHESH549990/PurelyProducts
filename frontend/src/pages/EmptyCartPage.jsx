import React from 'react';
import {Intro} from './ui';

export function EmptyCartMessage() {
 return <section className="empty-cart-message" aria-labelledby="empty-cart-title">
  <small>YOUR BAG IS EMPTY</small>
  <h2 id="empty-cart-title">Nothing in your bag yet.</h2>
  <p>When you add a product, it will appear here. Browse the shop and choose something you’d like to order.</p>
  <a className="btn primary" href="/product">Continue shopping <b>↗</b></a>
 </section>;
}

export default function EmptyCartPage() {
 return <main className="section empty-cart-page">
  <Intro title="Your bag" copy="Your selected products will be shown here."/>
  <EmptyCartMessage/>
 </main>;
}
