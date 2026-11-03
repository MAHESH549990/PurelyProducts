import React from 'react';

export const id = x => String(x?._id || x?.id || '');
export const image = x => typeof x?.image === 'string' ? x.image : x?.image?.url || '';
export const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(n)||0);
export const label = s => String(s||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]/g,' ').replace(/\.ejs$/i,'').replace(/\b\w/g,c=>c.toUpperCase());

export function Intro({title,copy}) { return <div className="intro"><small>PURELYPRODUCTS · YOUR EVERYDAY</small><h1>{title}</h1><p>{copy}</p></div>; }
export function Empty({title,copy,link}) { return <div className="empty"><span>✳</span><h3>{title}</h3><p>{copy}</p>{link&&<a className="btn outline" href={link}>Explore the shop ↗</a>}</div>; }
export function Field({label,name,type='text',required,defaultValue,placeholder,min,max}) { return <label className="field"><span>{label}</span><input name={name} type={type} required={required} defaultValue={defaultValue} placeholder={placeholder||label} min={min} max={max}/></label>; }
export function Status({value}) { return <span className={`status s-${String(value||'new').toLowerCase().replaceAll('_','-')}`}>{label(value||'new')}</span>; }

export function OrderTable({rows,path,submit}) {
 return <div className="table-shell"><table><thead><tr><th>Record</th><th>Status / information</th><th>Value</th><th>Actions</th></tr></thead><tbody>{rows.map((r,i)=>{
  const rid=id(r), product=r.name&&r.price!==undefined, order=r.products&&r.totalAmount!==undefined, partner=r.user||r.deliveryPartner;
  const name=product?r.name:order?`Order ${rid.slice(-7)}`:r.username||partner?.username||r.customer?.username||r.name||`Record ${i+1}`;
  const value=product?money(r.price):order?money(r.totalAmount):partner?.email||r.email||r.phone||'';
  return <tr key={rid||i}><td><a className="row-title" href={product?`/admin/products/${rid}`:order?path.startsWith('/delivery')?`/delivery/orders/assign/${rid}`:`/admin/users/orders/${rid}/assign-delivery`:partner?`/admin/delivery/approved/${rid}`:r.email?`/admin/users/details/${rid}`:'#'}>{name}</a><small>{order&&r.products?.length?`${r.products.length} product${r.products.length===1?'':'s'} · `:''}{rid.slice(-8)}</small>{order&&r.products?.length>0&&<span className="order-items-line">{r.products.map(x=>x.product?.name||'Product').join(' · ')}</span>}</td><td>{r.status?<Status value={r.status}/>:r.applicationStatus?<Status value={r.applicationStatus}/>:product?`★ ${r.rating||5}`:r.city||r.address||'—'}{order&&r.customer?.username&&<span className="order-customer-line">For {r.customer.username}</span>}</td><td>{value}</td><td><RowActions row={r} path={path} submit={submit}/></td></tr>;
 })}</tbody></table></div>;
}

function RowActions({row:r,path,submit}) {
 const rid=id(r);
 if(path.startsWith('/admin')&&r.name&&r.price!==undefined)return <div className="button-row"><a className="mini-action" href={`/admin/products/${rid}/update`}>Edit</a><form action={`/admin/products/${rid}`} data-method="DELETE" onSubmit={submit}><button className="mini-action dim">Delete</button></form></div>;
 if(path==='/orders/ordered'&&r.status)return <form action={`/orders/ordered/${rid}/details`} method="post" onSubmit={submit}><button className="mini-action">Details</button></form>;
 if(path.startsWith('/admin')&&r.status==='placed')return <form action={`/admin/users/orders/confirmed/${rid}/accept`} data-method="PATCH" onSubmit={submit}><button className="mini-action">Confirm order</button></form>;
 if(r.applicationStatus==='pending')return <div className="button-row"><form action={`/admin/delivery/${rid}/approve`} method="post" onSubmit={submit}><button className="mini-action">Approve</button></form><form action={`/admin/delivery/requests/${rid}/reject`} method="post" onSubmit={submit}><button className="mini-action dim">Decline</button></form></div>;
 if(r.status==='assigned'&&path.startsWith('/delivery'))return <form action={`/delivery/orders/${rid}/confirm`} method="post" onSubmit={submit}><button className="mini-action">Start delivery</button></form>;
 if(r.status==='out_for_delivery'&&path.startsWith('/delivery'))return <form action={`/delivery/orders/assign/${rid}/out-for-delivery/delivered`} data-method="PATCH" onSubmit={submit}><button className="mini-action">Mark delivered</button></form>;
 if(r.status==='confirmed'&&path.startsWith('/admin'))return <a className="mini-action" href={`/admin/users/orders/${rid}/assign-delivery`}>Assign partner</a>;
 if(r.licenseImage?.url)return <a className="mini-action" href={`/admin/delivery/${rid}/license`}>View licence</a>;
 return <a className="mini-action" href={r.name?`/admin/products/${rid}`:path.startsWith('/delivery')?`/delivery/orders/assign/${rid}`:`/admin/users/details/${rid}`}>View</a>;
}
