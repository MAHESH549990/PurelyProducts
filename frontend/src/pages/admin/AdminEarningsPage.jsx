import React from 'react';
import {id,money,Intro,Empty,Status} from '../ui';

const dateLabel=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)):'Date unavailable';

export default function AdminEarningsPage({data={}}){
 const metrics=data.earnings||{},orders=data.orders||[],months=metrics.months||[];
 const maxAmount=Math.max(1,...months.map(month=>Number(month.amount)||0));
 const current=months[months.length-1]||{amount:0,orders:0};
 return <main className="section delivery-earnings-page admin-earnings-page">
  <div className="delivery-earnings-heading"><Intro title="Admin earnings" copy="Track the fixed benefit from orders assigned to delivery partners."/></div>
  <section className="delivery-earnings-summary">
   <article><small>TOTAL BENEFIT</small><b>{money(metrics.totalEarnings)}</b><span>Across qualifying orders</span></article>
   <article><small>ORDERS ASSIGNED</small><b>{metrics.totalOrders||0}</b><span>Each order counts once</span></article>
   <article><small>THIS MONTH</small><b>{money(current.amount)}</b><span>{current.orders||0} qualifying orders</span></article>
   <article><small>BENEFIT PER ORDER</small><b>{money(metrics.rate||30)}</b><span>Recorded at assignment</span></article>
  </section>
  <section className="delivery-earnings-chart">
   <header><div><small>MONTHLY ADMIN BENEFIT</small><h2>Last six months</h2><p>Calculated from assigned, in-progress, and delivered orders.</p></div><span className="delivery-earnings-total">{money(metrics.totalEarnings)}<small>all-time benefit</small></span></header>
   {months.length?<div className="delivery-earnings-bars">{months.map(month=><div className="delivery-earnings-month" key={month.key}><div className="delivery-earnings-track"><span style={{height:((Number(month.amount)||0)/maxAmount*100)+'%'}}/></div><b>{money(month.amount)}</b><small>{month.label}</small><em>{month.orders||0} orders</em></div>)}</div>:<Empty title="No assigned orders yet" copy="Admin benefit will appear when an order is assigned to a delivery partner."/>}
  </section>
  <section className="delivery-earnings-breakdown">
   <header><div><small>MONTH-BY-MONTH</small><h2>Benefit breakdown</h2></div><span>Fixed benefit: {money(metrics.rate||30)} per order</span></header>
   <div className="delivery-earnings-table"><div className="delivery-earnings-table-head"><b>Month</b><b>Qualifying orders</b><b>Benefit</b></div>{months.slice().reverse().map(month=><div className="delivery-earnings-table-row" key={month.key}><b>{month.label} {month.key.slice(0,4)}</b><span>{month.orders||0}</span><strong>{money(month.amount)}</strong></div>)}</div>
  </section>
  <section className="delivery-earnings-history">
   <header><div><small>ORDER ASSIGNMENTS</small><h2>Benefit by order</h2></div><span>{orders.length} qualifying orders</span></header>
   {orders.length?<div className="delivery-earnings-order-list">{orders.map(order=>{
    const lines=order.products||[];
    return <article className="delivery-earnings-order admin-benefit-order" key={id(order)}>
     <div className="delivery-earnings-order-main"><small>ORDER #{id(order).slice(-8).toUpperCase()}</small><b>{order.customer?.username||'Customer'}</b><span>{dateLabel(order.assignedAt||order.createdAt)}</span></div>
     <div className="delivery-earnings-order-items"><small>DELIVERY PARTNER · {order.deliveryPartner?.username||'Assigned partner'}</small><b>{lines.map(line=>(line.product?.name||'Product')+' × '+line.quantity).join(' · ')||'Order items unavailable'}</b></div>
     <div className="delivery-earnings-order-total"><small>ORDER VALUE</small><b>{money(order.totalAmount)}</b></div>
     <Status value={order.status}/>
     <div className="delivery-earnings-order-pay"><small>ADMIN BENEFIT</small><b>{money(order.adminProfit||metrics.rate||30)}</b></div>
    </article>;
   })}</div>:<Empty title="No qualifying orders yet" copy="Orders with a delivery partner assignment will appear here." link="/admin/users/orders/accepted"/>}
  </section>
 </main>;
}
