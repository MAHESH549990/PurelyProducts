import React from 'react';
import {id,money,Intro,Empty,Status} from '../ui';

const dateLabel=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)):'Date unavailable';
const orderAddress=address=>[address?.location,address?.city,address?.state].filter(Boolean).join(', ');

export default function DeliveryEarningsPage({data={}}){
 const metrics=data.earnings||{},orders=data.orders||[],months=metrics.months||[];
 const maxAmount=Math.max(1,...months.map(month=>Number(month.amount)||0));
 const current=months[months.length-1]||{amount:0,orders:0};
 return <main className="section delivery-earnings-page">
  <div className="delivery-earnings-heading"><Intro title="Your earnings" copy="A clear record of completed deliveries and partner payouts."/><a className="admin-secondary" href="/delivery">← Delivery dashboard</a></div>
  <section className="delivery-earnings-summary">
   <article><small>TOTAL EARNED</small><b>{money(metrics.totalEarnings)}</b><span>Across completed orders</span></article>
   <article><small>ORDERS DELIVERED</small><b>{metrics.totalOrders||0}</b><span>Each completed order counts once</span></article>
   <article><small>THIS MONTH</small><b>{money(current.amount)}</b><span>{current.orders||0} completed deliveries</span></article>
   <article><small>RATE PER ORDER</small><b>{money(metrics.rate||40)}</b><span>Regardless of item count</span></article>
  </section>
  <section className="delivery-earnings-chart">
   <header><div><small>MONTHLY PAYOUTS</small><h2>Last six months</h2><p>Only orders marked delivered are included.</p></div><span className="delivery-earnings-total">{money(metrics.totalEarnings)}<small>total earned</small></span></header>
   {months.length?<div className="delivery-earnings-bars">{months.map(month=><div className="delivery-earnings-month" key={month.key}><div className="delivery-earnings-track"><span style={{height:((Number(month.amount)||0)/maxAmount*100)+'%'}}/></div><b>{money(month.amount)}</b><small>{month.label}</small><em>{month.orders||0} orders</em></div>)}</div>:<Empty title="No earnings yet" copy="Completed deliveries will appear in your earnings graph."/>}
  </section>
  <section className="delivery-earnings-breakdown">
   <header><div><small>MONTH-BY-MONTH</small><h2>Payout breakdown</h2></div><span>Fixed rate: {money(metrics.rate||40)} per delivered order</span></header>
   <div className="delivery-earnings-table"><div className="delivery-earnings-table-head"><b>Month</b><b>Delivered orders</b><b>Earnings</b></div>{months.slice().reverse().map(month=><div className="delivery-earnings-table-row" key={month.key}><b>{month.label} {month.key.slice(0,4)}</b><span>{month.orders||0}</span><strong>{money(month.amount)}</strong></div>)}</div>
  </section>
  <section className="delivery-earnings-history">
   <header><div><small>COMPLETED WORK</small><h2>Delivered order details</h2></div><span>{orders.length} orders</span></header>
   {orders.length?<div className="delivery-earnings-order-list">{orders.map(order=>{
    const lines=order.products||[],quantity=lines.reduce((sum,line)=>sum+(Number(line.quantity)||0),0);
    return <article className="delivery-earnings-order" key={id(order)}>
     <div className="delivery-earnings-order-main"><small>ORDER #{id(order).slice(-8).toUpperCase()}</small><b>{order.customer?.username||'Customer'}</b><span>{dateLabel(order.deliveredAt||order.createdAt)}</span>{orderAddress(order.deliveryAddress)&&<span className="delivery-earnings-address">⌖ {orderAddress(order.deliveryAddress)}</span>}</div>
     <div className="delivery-earnings-order-items"><small>{quantity} items</small><b>{lines.map(line=>(line.product?.name||'Product')+' × '+line.quantity).join(' · ')||'Order details unavailable'}</b></div>
     <div className="delivery-earnings-order-total"><small>ORDER VALUE</small><b>{money(order.totalAmount)}</b></div>
     <Status value={order.status}/>
     <div className="delivery-earnings-order-pay"><small>YOUR EARNING</small><b>{money(order.deliveryEarnings||metrics.rate||40)}</b></div>
    </article>;
   })}</div>:<Empty title="No completed deliveries yet" copy="When you mark an assigned order as delivered, its earnings will be listed here." link="/delivery/orders/assign"/>}
  </section>
 </main>;
}
