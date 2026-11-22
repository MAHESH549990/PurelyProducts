import React,{useMemo,useState} from 'react';
import {id,money,Intro,Empty,Status} from '../ui';

function serviceArea(partner){
 const saved=partner.user?.address||[];
 const address=saved[saved.length-1]||saved[0];
 return partner.address||[address?.location,address?.city,address?.state].filter(Boolean).join(', ')||'Location not provided';
}

export default function DeliveryPartnersPage({data={}}){
 const [query,setQuery]=useState('');
 const partners=data.deliveries||[],stats=data.partnerStats||{};
 const filtered=useMemo(()=>partners.filter(partner=>{
  const user=partner.user||{};
  return [user.username,user.email,partner.phone,partner.vehicleNumber,serviceArea(partner)].join(' ').toLowerCase().includes(query.toLowerCase());
 }),[partners,query]);
 const totalDelivered=partners.reduce((sum,partner)=>sum+(stats[id(partner)]?.deliveredOrders||0),0);
 const totalEarnings=partners.reduce((sum,partner)=>sum+(stats[id(partner)]?.totalEarnings||0),0);
 const activeCount=partners.reduce((sum,partner)=>sum+(stats[id(partner)]?.activeOrders||0),0);
 return <main className="section admin-workspace partner-directory">
  <div className="admin-page-heading"><div><small>PURELYPRODUCTS · ADMIN TEAM</small><h1>Delivery partners</h1><p>Partner profiles, assigned work, delivery history, and earnings.</p></div><a className="admin-secondary" href="/admin/delivery/requests">Review applications ↗</a></div>
  <div className="partner-directory-stats">
   <article><small>APPROVED PARTNERS</small><b>{partners.length}</b></article>
   <article><small>ACTIVE DELIVERIES</small><b>{activeCount}</b></article>
   <article><small>ORDERS DELIVERED</small><b>{totalDelivered}</b></article>
   <article><small>PARTNER EARNINGS</small><b>{money(totalEarnings)}</b></article>
  </div>
  <div className="partner-directory-toolbar"><div><small>PARTNER DIRECTORY</small><h2>Delivery team</h2><p>Select a partner to view their profile and order activity.</p></div><label className="partner-search"><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search partners"/></label></div>
  {filtered.length?<div className="partner-directory-grid">{filtered.map(partner=>{
   const user=partner.user||{},summary=stats[id(partner)]||{};
   return <article className="partner-directory-card" key={id(partner)}>
    <header><span className="partner-directory-avatar">{(user.username||'D').slice(0,1).toUpperCase()}</span><div><small>DELIVERY PARTNER</small><h3>{user.username||'Partner account'}</h3><p>{user.email||partner.phone||'Contact unavailable'}</p></div><Status value={partner.applicationStatus}/></header>
    <div className="partner-directory-location"><span>⌖</span><div><small>SERVICE LOCATION</small><b>{serviceArea(partner)}</b></div></div>
    <div className="partner-directory-metrics"><div><small>DELIVERED</small><b>{summary.deliveredOrders||0}</b></div><div><small>ACTIVE</small><b>{summary.activeOrders||0}</b></div><div><small>EARNED</small><b>{money(summary.totalEarnings||0)}</b></div></div>
    <a className="partner-directory-link" href={'/admin/delivery/approved/'+id(partner)}>View partner details <span>↗</span></a>
   </article>;
  })}</div>:<Empty title={partners.length?'No matching partners':'No approved partners yet'} copy={partners.length?'Try a different name, email, phone, or location.':'Approved delivery partners will appear here.'} link={partners.length?undefined:'/admin/delivery/requests'}/>}
 </main>;
}
