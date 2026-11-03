import React from 'react';
import AdminPage from '../AdminPage';
import {id,image,money,Intro,Empty,Status} from '../ui';

export default function AssignDeliveryPage(props){
 const {data={},submit}=props,order=data.order,partners=data.deliveries||[];
 if(!order)return <AdminPage {...props} titleOverride="Approved delivery partners"/>;
 const products=order.products||[],canAssign=order.status==='confirmed';
 return <main className="section admin-workspace assign-delivery-page">
  <a className="order-back-link" href="/admin/users/orders/accepted">← Back to confirmed orders</a>
  <Intro title="Order delivery" copy="Review the order and assign an approved partner when it is ready."/>
  <section className="assignment-order-card">
   <div className="assignment-order-heading"><div><small>ORDER</small><h2>#{id(order).slice(-8).toUpperCase()}</h2></div><Status value={order.status}/></div>
   <div className="assignment-order-info"><span>Customer <b>{order.customer?.username||'Customer'}</b></span><span>Order total <b>{money(order.totalAmount)}</b></span><span>{products.length} product{products.length===1?'':'s'}</span></div>
   <div className="assignment-order-products">{products.map((line,index)=><div className="assignment-product" key={`${id(line.product)}-${index}`}><span className="assignment-product-image">{image(line.product)?<img src={image(line.product)} alt={line.product?.name||'Product'}/>:<span>PP</span>}</span><span>{line.product?.name||'Product'}<small>Qty {line.quantity}</small></span><b>{money((Number(line.product?.price)||0)*(Number(line.quantity)||0))}</b></div>)}</div>
  </section>
  {canAssign?<><div className="assignment-partner-heading"><div><small>APPROVED PARTNERS</small><h2>Select a delivery partner</h2></div><a href="/admin/delivery/approved">View all partners ↗</a></div>{partners.length?<div className="assignment-partner-grid">{partners.map(partner=>{const person=partner.user||{};return <article className="assignment-partner-card" key={id(partner)}><div className="assignment-partner-avatar">{(person.username||'D').slice(0,1).toUpperCase()}</div><div className="assignment-partner-name"><h3>{person.username||'Delivery partner'}</h3><Status value={partner.applicationStatus}/></div><dl><div><dt>Phone</dt><dd>{partner.phone||'—'}</dd></div><div><dt>Experience</dt><dd>{partner.experience||'—'}</dd></div><div><dt>Vehicle</dt><dd>{partner.vehicleNumber||'—'}</dd></div><div><dt>Service address</dt><dd>{partner.address||'—'}</dd></div></dl><form action={`/admin/users/orders/${id(order)}/assign-delivery`} method="post" onSubmit={submit}><input type="hidden" name="deliveryPartnerId" value={id(person)}/><button className="btn primary wide">Assign this partner ↗</button></form></article>})}</div>:<Empty title="No approved partners yet" copy="Approve a delivery partner first, then return here to assign this order." link="/admin/delivery/requests"/>}</>:<section className="assignment-current-state"><small>DELIVERY ASSIGNMENT</small>{order.status==='assigned'?<><h2>Partner already assigned</h2><p>{order.deliveryPartner?.username||'A delivery partner'} is assigned to this order.</p>{order.deliveryPartner?.email&&<a href={`mailto:${order.deliveryPartner.email}`}>{order.deliveryPartner.email}</a>}</>:<><h2>Confirm this order first</h2><p>Delivery partners can be assigned after the order status becomes confirmed.</p><a className="mini-action" href="/admin/users/orders/pending">Go to orders to review ↗</a></>}</section>}
 </main>;
}
