import React,{useState} from 'react';
import {money,Intro} from './ui';

export default function CheckoutPage({data={}}) {
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const [cardholderName,setCardholderName]=useState(''),[cardNumber,setCardNumber]=useState(''),[expiryDate,setExpiryDate]=useState(''),[cvv,setCvv]=useState('');
 const deliveryCharge=Number(data.deliveryCharge)||0,total=Number(data.orderTotal??(Number(data.totalProductsPrice||0)+deliveryCharge));
 async function makePayment(event){
  event.preventDefault();
  if(busy)return;
  const digits=cardNumber.replace(/\D/g,'');
  const month=Number(expiryDate.slice(0,2));
  if(!cardholderName.trim()){setError('Please enter the cardholder name.');return}
  if(digits.length!==16){setError('Please enter a 16-digit demo card number.');return}
  if(!/^\d{2}\/\d{2}$/.test(expiryDate)||month<1||month>12){setError('Enter expiry date as MM/YY.');return}
  if(!/^\d{3}$/.test(cvv)){setError('Please enter a 3-digit CVV.');return}
  setBusy(true);setError('');
  try{
   const sessionResponse=await fetch('/product/cart/payment-session',{method:'POST',credentials:'same-origin',headers:{Accept:'application/json'}});
   const session=await sessionResponse.json();
   if(!sessionResponse.ok)throw new Error(session.error||'Could not start checkout. Please try again.');
   await new Promise(resolve=>setTimeout(resolve,2500));
   const paymentResponse=await fetch('/product/cart/payment/complete',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({demoSessionId:session.demoSessionId,cardholderName:cardholderName.trim()})});
   const result=await paymentResponse.json();
   if(!paymentResponse.ok)throw new Error(result.error||'Could not complete the demo payment. Your cart is still available.');
   const destination=result.redirect||'/orders/ordered';
   window.history.pushState({},'',destination);
   window.dispatchEvent(new PopStateEvent('popstate'));
  }catch(cause){setError(cause.message||'Could not complete checkout. Please try again.');setBusy(false)}
 }
 function formatCardNumber(value){setCardNumber(value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 '))}
 function formatExpiry(value){const digits=value.replace(/\D/g,'').slice(0,4);setExpiryDate(digits.length>2?`${digits.slice(0,2)}/${digits.slice(2)}`:digits)}
 return <main className="section checkout-page"><Intro title="Payment Session" copy="Enter demo card details to complete your order."/><div className="fake-card-layout"><div className="fake-card-art"><img src="/images/card_img.png" alt="Illustration of a payment card"/><div className="fake-card-total"><small>ORDER TOTAL</small><strong>{money(total)}</strong><span>Includes {deliveryCharge?`${money(deliveryCharge)} delivery`:'free delivery'}</span></div></div><section className="fake-card-panel"><form className="fake-card-form" onSubmit={makePayment} noValidate><div className="fake-card-field"><label htmlFor="cardholder-name">Cardholder Name</label><input id="cardholder-name" type="text" autoComplete="off" maxLength={80} placeholder="Name on card" value={cardholderName} onChange={event=>setCardholderName(event.target.value)} disabled={busy}/></div><div className="fake-card-field"><label htmlFor="card-number">Card Number</label><input id="card-number" type="text" inputMode="numeric" autoComplete="off" maxLength={19} placeholder="0000 0000 0000 0000" value={cardNumber} onChange={event=>formatCardNumber(event.target.value)} disabled={busy}/></div><div className="fake-card-row"><div className="fake-card-field"><label htmlFor="expiry-date">Expiry Date</label><input id="expiry-date" type="text" inputMode="numeric" autoComplete="off" maxLength={5} placeholder="MM/YY" value={expiryDate} onChange={event=>formatExpiry(event.target.value)} disabled={busy}/></div><div className="fake-card-field"><label htmlFor="cvv">CVV</label><input id="cvv" type="password" inputMode="numeric" autoComplete="off" maxLength={3} placeholder="123" value={cvv} onChange={event=>setCvv(event.target.value.replace(/\D/g,'').slice(0,3))} disabled={busy}/></div></div><p className="fake-card-disclaimer">Demo only: use fake details. These card fields stay in this page and are not saved or sent to a payment provider.</p>{error&&<p className="payment-error" role="alert">{error}</p>}<button type="submit" className="btn primary wide" disabled={busy}>{busy?'Processing payment…':`Pay Now · ${money(total)}`}</button></form></section></div></main>;
}
