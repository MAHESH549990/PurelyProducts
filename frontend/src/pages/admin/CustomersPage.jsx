import React,{useMemo,useState} from 'react';
import {id,money,Status,Intro,Empty} from '../ui';

function customerAddress(customer){
 const list=customer.address||[],address=list[list.length-1]||list[0];
 return address?[address.location,address.city,address.state,address.country].filter(Boolean).join(', '):'No saved address';
}

export default function CustomersPage({data={}}){
 const [query,setQuery]=useState('');
 const customers=data.users||[],stats=data.customerStats||{};
 const filtered=useMemo(()=>customers.filter(customer=>[
  customer.username,customer.email,customerAddress(customer)
 ].join(' ').toLowerCase().includes(query.trim().toLowerCase())),[customers,query]);
 const orders=Object.values(stats).reduce((sum,item)=>sum+(item.orders||0),0);
 const spend=Object.values(stats).reduce((sum,item)=>sum+(item.spend||0),0);
 const active=Object.values(stats).filter(item=>item.orders>0).length;
 return <main className="section admin-workspace customer-directory">
  <div className="admin-page-heading"><div><small>PURELYPRODUCTS · PEOPLE</small><h1>Customers</h1><p>Customer accounts, saved locations, and shopping activity.</p></div></div>
  <div className="customer-directory-stats"><article><small>CUSTOMER ACCOUNTS</small><b>{customers.length}</b></article><article><small>WITH ORDERS</small><b>{active}</b></article><article><small>ORDERS PLACED</small><b>{orders}</b></article><article><small>ORDER VALUE</small><b>{money(spend)}</b></article></div>
  <div className="customer-directory-toolbar"><div><small>CUSTOMER DIRECTORY</small><h2>All customers</h2><p>Open a profile to see saved addresses and order history.</p></div><label className="customer-search"><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search name, email, or location"/></label></div>
  {filtered.length?<div className="customer-directory-grid">{filtered.map((customer,index)=>{
   const summary=stats[id(customer)]||{};
   return <article className="customer-directory-card" key={id(customer)}>
    <header><span className="customer-avatar">{(customer.username||'C').slice(0,1).toUpperCase()}</span><div><small>CUSTOMER {String(index+1).padStart(2,'0')}</small><h3>{customer.username||'Customer account'}</h3><p>{customer.email||'Email not provided'}</p></div><Status value={customer.role||'customer'}/></header>
    <div className="customer-directory-location"><span>⌖</span><div><small>SAVED LOCATION</small><b>{customerAddress(customer)}</b></div></div>
    <div className="customer-directory-metrics"><div><small>ORDERS</small><b>{summary.orders||0}</b></div><div><small>DELIVERED</small><b>{summary.delivered||0}</b></div><div><small>SPENT</small><b>{money(summary.spend||0)}</b></div></div>
    <a className="customer-directory-link" href={'/admin/users/details/'+id(customer)}>View customer details <span>↗</span></a>
   </article>;
  })}</div>:<Empty title={customers.length?'No matching customers':'No customers found'} copy={customers.length?'Try another name, email, or location.':'Customer accounts will appear here when available.'}/>}
 </main>;
}
