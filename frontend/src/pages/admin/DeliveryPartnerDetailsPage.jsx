import React from 'react';
import {id,money,Intro,Empty,Status} from '../ui';
import LocationMap from '../LocationMap';

const dateLabel=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(value)):'—';
const savedAddress=user=>{
 const list=user?.address||[],address=list[list.length-1]||list[0];
 return address?[address.location,address.city,address.state].filter(Boolean).join(', '):'';
};

export default function DeliveryPartnerDetailsPage({data={}}){
 const partner=data.delivery,user=partner?.user||{},metrics=data.metrics||{},orders=data.orders||[];
 if(!partner)return <main className="section"><Empty title="Partner not found" copy="This delivery partner record is unavailable." link="/admin/delivery/approved"/></main>;
 const location=savedAddress(user)||partner.address||'';
 const months=metrics.months||[],maxEarning=Math.max(1,...months.map(month=>Number(month.amount)||0));
 return <main className="section admin-workspace partner-detail-page">
  <div className="admin-page-heading"><div><a className="admin-crumb" href="/admin/delivery/approved">Delivery partners <span>/</span> Details</a><small>DELIVERY TEAM · PARTNER PROFILE</small><h1>{user.username||'Delivery partner'}</h1><p>Profile, service location, completed deliveries, and earnings.</p></div><a className="admin-secondary" href="/admin/delivery/approved">← All partners</a></div>
  <section className="partner-detail-hero">
   <div className="partner-detail-identity"><span className="partner-directory-avatar large">{(user.username||'D').slice(0,1).toUpperCase()}</span><div><small>PARTNER ACCOUNT</small><h2>{user.username||'Delivery partner'}</h2><p>{user.email||'Email not provided'}</p></div><Status value={partner.applicationStatus}/></div>
   <div className="partner-detail-facts"><PartnerFact label="Phone" value={partner.phone}/><PartnerFact label="Experience" value={partner.experience}/><PartnerFact label="Vehicle" value={partner.vehicleNumber}/><PartnerFact label="Licence number" value={partner.licenseNumber}/><PartnerFact label="Joined" value={dateLabel(partner.createdAt)}/><PartnerFact label="Application reviewed" value={dateLabel(partner.reviewedAt)}/></div>
   {partner.licenseImage?.url&&<a className="partner-license-link" href={'/admin/delivery/'+id(partner)+'/license'}>View licence document ↗</a>}
  </section>
  <section className="partner-detail-stats">
   <article><small>ORDERS ASSIGNED</small><b>{metrics.totalOrders||0}</b><span>All order statuses</span></article>
   <article><small>DELIVERED</small><b>{metrics.deliveredOrders||0}</b><span>Completed handoffs</span></article>
   <article><small>IN PROGRESS</small><b>{metrics.activeOrders||0}</b><span>Assigned or on route</span></article>
   <article><small>TOTAL EARNED</small><b>{money(metrics.totalEarnings||0)}</b><span>₹40 per delivered order</span></article>
  </section>
  <section className="partner-earnings-chart"><div className="partner-section-heading"><div><small>DELIVERY EARNINGS</small><h2>Last six months</h2></div><span>₹40 per completed order</span></div><div className="partner-chart-bars">{months.map(month=><div className="partner-chart-month" key={month.key}><div className="partner-chart-track"><span style={{height:((Number(month.amount)||0)/maxEarning*100)+'%'}}/></div><b>{money(month.amount)}</b><small>{month.label}</small></div>)}</div></section>
  {location&&<div className="partner-detail-location"><LocationMap address={location} token={data.mapToken}/><div className="partner-service-address"><small>SERVICE / ACCOUNT LOCATION</small><b>{location}</b></div></div>}
  <section className="partner-order-history"><div className="partner-section-heading"><div><small>RECENT ACTIVITY</small><h2>Recent assigned orders</h2></div><span>{metrics.totalOrders||0} total</span></div>
   {orders.length?<div className="partner-order-history-list">{orders.map(order=><article className="partner-history-row" key={id(order)}><div><b>Order #{id(order).slice(-8).toUpperCase()}</b><small>{order.customer?.username||'Customer'} · {dateLabel(order.createdAt)}</small><small>{(order.products||[]).map(line=>line.product?.name||'Product').join(' · ')}</small></div><Status value={order.status}/><strong>{money(order.totalAmount)}</strong><span className="partner-history-earned">{order.status==='delivered'?money(order.deliveryEarnings||40):'—'}</span></article>)}</div>:<Empty title="No assigned orders yet" copy="Orders assigned to this partner will appear here."/>}
  </section>
 </main>;
}

function PartnerFact({label,value}){return <div className="partner-detail-fact"><small>{label}</small><b>{value||'Not provided'}</b></div>}
