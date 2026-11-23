import React from 'react';
import {id,money,Intro,Empty,Status} from '../ui';

const dateLabel=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium'}).format(new Date(value)):'Date unavailable';
function profitOf(order){
 const lines=order.products||[];
 if(!lines.length||order.status!=='delivered')return null;
 let grossRevenue=0,cost=0;
 for(const line of lines){if(line.unitPriceAtPurchase==null||line.unitCostAtPurchase==null)return null;const q=Number(line.quantity),p=Number(line.unitPriceAtPurchase),c=Number(line.unitCostAtPurchase);if(!Number.isFinite(q)||q<=0||!Number.isFinite(p)||!Number.isFinite(c))return null;grossRevenue+=p*q;cost+=c*q;}
 const discounts=Number(order.discountAmount)||0,revenue=Math.max(0,grossRevenue-discounts),fees=Number(order.deliveryCharge)||0,payout=Number(order.deliveryEarnings)>0?Number(order.deliveryEarnings):40;
 return {grossRevenue,discounts,revenue,cost,fees,payout,profit:revenue-cost+fees-payout};
}

export default function AdminEarningsPage({data={}}){
 const metrics=data.earnings||{},allOrders=data.orders||[],months=metrics.months||[];
 const orders=allOrders.filter(order=>profitOf(order)!==null).sort((a,b)=>new Date(b.deliveredAt||b.createdAt)-new Date(a.deliveredAt||a.createdAt));
 const current=months[months.length-1]||{amount:0,orders:0},maxAmount=Math.max(1,...months.map(month=>Math.abs(Number(month.amount)||0)));
 return <main className="section delivery-earnings-page admin-earnings-page">
  <div className="delivery-earnings-heading"><Intro title="Order profit" copy="A transparent estimate from delivered orders and costs recorded at checkout."/><a className="admin-secondary" href="/admin/products">Manage product costs ↗</a></div>
  <div className="admin-profit-note"><b>How this is calculated</b><span>Product sales − customer discounts − recorded product cost + delivery fee collected − delivery partner payout (₹40 per order).</span><small>Taxes, payment fees, returns and other operating costs are not included. This is an estimate from tracked costs, not accounting profit.</small></div>
  <section className="delivery-earnings-summary admin-profit-summary">
   <article><small>ESTIMATED PROFIT</small><b>{money(metrics.totalProfit??metrics.totalEarnings)}</b><span>{metrics.totalOrders||0} delivered orders with cost data</span></article>
   <article><small>GROSS PRODUCT SALES</small><b>{money(metrics.grossRevenue)}</b><span>Before order discounts</span></article>
   <article><small>CUSTOMER DISCOUNTS</small><b>−{money(metrics.discounts)}</b><span>Discounts granted on qualifying orders</span></article>
   <article><small>NET PRODUCT REVENUE</small><b>{money(metrics.revenue)}</b><span>Sales after discounts</span></article>
   <article><small>PRODUCT COST</small><b>{money(metrics.productCost)}</b><span>Admin recorded purchase costs</span></article>
   <article><small>DELIVERY NET</small><b>{money((Number(metrics.deliveryFees)||0)-(Number(metrics.deliveryPayout)||0))}</b><span>{money(metrics.deliveryFees)} collected · {money(metrics.deliveryPayout)} partner payout</span></article>
  </section>
  {metrics.missingCostOrders>0&&<div className="admin-profit-missing"><b>{metrics.missingCostOrders} delivered {metrics.missingCostOrders===1?'order is':'orders are'} missing cost history.</b> They’re excluded from profit because their product costs were not saved at checkout. New orders capture costs automatically after you enter a purchase cost for each product.</div>}
  <section className="delivery-earnings-chart">
   <header><div><small>MONTHLY ESTIMATED PROFIT</small><h2>Last six months</h2><p>Only delivered orders with complete cost snapshots are counted.</p></div><span className="delivery-earnings-total">{money(metrics.totalProfit??metrics.totalEarnings)}<small>tracked profit</small></span></header>
   {months.length?<div className="delivery-earnings-bars">{months.map(month=>{const amount=Number(month.amount)||0;return <div className="delivery-earnings-month" key={month.key}><div className="delivery-earnings-track"><span className={amount<0?'is-negative':''} style={{height:(Math.abs(amount)/maxAmount*100)+'%'}}/></div><b className={amount<0?'is-negative-text':''}>{money(amount)}</b><small>{month.label}</small><em>{month.orders||0} orders</em></div>})}</div>:<Empty title="No delivered orders yet" copy="Tracked profit appears after a delivered order has product cost snapshots."/>}
  </section>
  <section className="delivery-earnings-breakdown admin-profit-breakdown">
   <header><div><small>MONTH-BY-MONTH</small><h2>Profit breakdown</h2></div><span>Tracked costs only</span></header>
   <div className="admin-profit-table"><div className="admin-profit-table-head"><b>Month</b><b>Orders</b><b>Gross sales</b><b>Discounts</b><b>Net revenue</b><b>Product cost</b><b>Delivery fees</b><b>Partner payout</b><b>Profit</b></div>{months.slice().reverse().map(month=><div className="admin-profit-table-row" key={month.key}><b>{month.label} {month.key.slice(0,4)}</b><span>{month.orders||0}</span><span>{money(month.grossRevenue)}</span><span>{money(month.discounts)}</span><span>{money(month.revenue)}</span><span>{money(month.productCost)}</span><span>{money(month.deliveryFees)}</span><span>{money(month.deliveryPayout)}</span><strong className={(Number(month.amount)||0)<0?'is-negative-text':''}>{money(month.amount)}</strong></div>)}</div>
  </section>
  <section className="delivery-earnings-history">
   <header><div><small>DELIVERED ORDERS</small><h2>Profit by order</h2></div><span>{orders.length} orders with complete cost data</span></header>
   {orders.length?<div className="delivery-earnings-order-list">{orders.map(order=>{const lines=order.products||[],profit=profitOf(order);return <article className="delivery-earnings-order admin-profit-order" key={id(order)}>
     <div className="delivery-earnings-order-main"><small>ORDER #{id(order).slice(-8).toUpperCase()}</small><b>{order.customer?.username||'Customer'}</b><span>{dateLabel(order.deliveredAt||order.createdAt)}</span></div>
     <div className="delivery-earnings-order-items"><small>ITEMS</small><b>{lines.map(line=>(line.product?.name||'Product')+' × '+line.quantity).join(' · ')}</b></div>
     <div className="admin-profit-order-costs"><span>Gross sales <b>{money(profit.grossRevenue)}</b></span><span>Discount <b>−{money(profit.discounts)}</b></span><span>Net revenue <b>{money(profit.revenue)}</b></span><span>Product cost <b>{money(profit.cost)}</b></span><span>Delivery fee <b>{money(profit.fees)}</b></span><span>Partner payout <b>{money(profit.payout)}</b></span></div>
     <Status value={order.status}/><div className="delivery-earnings-order-pay"><small>EST. PROFIT</small><b className={profit.profit<0?'is-negative-text':''}>{money(profit.profit)}</b></div>
    </article>})}</div>:<Empty title="No cost-complete delivered orders" copy="Once an order with recorded product costs is delivered, its profit breakdown will appear here." link="/admin/users/orders/accepted"/>}
  </section>
 </main>;
}
