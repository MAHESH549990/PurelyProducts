import React from 'react';
import {id,money,Status,Empty} from '../ui';
import LocationMap from '../LocationMap';

const dateLabel=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(value)):'—';
function addressLabel(address){
 return [address?.location,address?.city,address?.state,address?.country].filter(Boolean).join(', ');
}
function spendingMonths(orders){
 const now=new Date(),months=Array.from({length:6},(_,index)=>{
  const date=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-5+index,1));
  return {key:date.getUTCFullYear()+'-'+String(date.getUTCMonth()+1).padStart(2,'0'),label:new Intl.DateTimeFormat('en-IN',{month:'short',timeZone:'UTC'}).format(date),amount:0,count:0};
 });
 const byKey=new Map(months.map(month=>[month.key,month]));
 for(const order of orders){
  const date=new Date(order.createdAt||Date.now()),key=date.getUTCFullYear()+'-'+String(date.getUTCMonth()+1).padStart(2,'0'),month=byKey.get(key);
  if(month){month.amount+=Number(order.totalAmount)||0;month.count+=1;}
 }
 return months;
}

export default function CustomerDetailsPage({data={}}){
 const customer=data.customer||data.users,orders=data.orders||[];
 if(!customer)return <main className="section"><Empty title="Customer not found" copy="This customer record is unavailable in the connected database." link="/admin/users/details"/></main>;
 const addresses=customer.address||[],savedAddress=addresses[addresses.length-1]||addresses[0],location=addressLabel(savedAddress);
 const spend=orders.reduce((sum,order)=>sum+(Number(order.totalAmount)||0),0);
 const delivered=orders.filter(order=>order.status==='delivered').length;
 const months=spendingMonths(orders),maxAmount=Math.max(1,...months.map(month=>month.amount));
 return <main className="section admin-workspace customer-detail-page">
  <div className="admin-page-heading"><div><a className="admin-crumb" href="/admin/users/details">Customers <span>/</span> Details</a><small>PURELYPRODUCTS · CUSTOMER RECORD</small><h1>{customer.username||'Customer details'}</h1><p>Account, saved address, and order activity.</p></div><a className="admin-secondary" href="/admin/users/details">← All customers</a></div>
  <section className="customer-detail-hero"><header><span className="customer-avatar large">{(customer.username||'C').slice(0,1).toUpperCase()}</span><div><small>CUSTOMER ACCOUNT</small><h2>{customer.username||'Customer'}</h2><p>{customer.email||'Email not provided'}</p></div><Status value={customer.role||'customer'}/></header><div className="customer-detail-facts"><CustomerFact label="Account ID" value={id(customer)}/><CustomerFact label="Account created" value={dateLabel(customer.createdAt)}/><CustomerFact label="Saved addresses" value={addresses.length}/><CustomerFact label="Primary location" value={location||'No saved address'}/></div></section>
  <section className="customer-detail-stats"><article><small>ORDERS PLACED</small><b>{orders.length}</b><span>Order history in this account</span></article><article><small>DELIVERED</small><b>{delivered}</b><span>Completed deliveries</span></article><article><small>TOTAL SPENT</small><b>{money(spend)}</b><span>Sum of recorded order totals</span></article><article><small>AVERAGE ORDER</small><b>{money(orders.length?spend/orders.length:0)}</b><span>Across all recorded orders</span></article></section>
  {location&&<div className="customer-detail-location"><LocationMap address={savedAddress} token={data.mapToken}/><section><small>DELIVERY ADDRESS</small><h2>Saved locations</h2>{addresses.map((address,index)=><article key={id(address)||index}><b>{addressLabel(address)}</b><span>{address.country||'India'}{index===addresses.length-1?' · Most recently saved':''}</span></article>)}</section></div>}
  <section className="customer-spending-chart"><div className="customer-section-heading"><div><small>CUSTOMER ACTIVITY</small><h2>Order value · last six months</h2></div><span>{orders.length} total orders</span></div><div className="customer-chart-bars">{months.map(month=><div className="customer-chart-month" key={month.key}><div className="customer-chart-track"><span style={{height:(month.amount/maxAmount*100)+'%'}}/></div><b>{money(month.amount)}</b><small>{month.label}</small></div>)}</div></section>
  <section className="customer-history"><div className="customer-section-heading"><div><small>ORDER HISTORY</small><h2>Recent customer orders</h2></div><span>{orders.length} total</span></div>{orders.length?<div className="customer-order-list">{orders.map(order=><article key={id(order)} className="customer-order-row"><div><b>Order #{id(order).slice(-8).toUpperCase()}</b><small>{(order.products||[]).map(line=>line.product?.name||'Product').join(' · ')||'Order items'}</small><small>{dateLabel(order.createdAt)} · {order.products?.reduce((sum,line)=>sum+(Number(line.quantity)||0),0)||0} items</small></div><Status value={order.status}/><strong>{money(order.totalAmount)}</strong></article>)}</div>:<div className="customer-no-orders">This customer has not placed an order yet.</div>}</section>
 </main>;
}
function CustomerFact({label,value}){return <div><small>{label}</small><b>{value||'—'}</b></div>}
