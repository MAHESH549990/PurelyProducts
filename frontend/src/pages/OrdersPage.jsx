import React from 'react';
import {Intro,Empty,OrderTable,id,image,money,Status} from './ui';

const steps=[['placed','Order placed'],['confirmed','Confirmed'],['assigned','Courier assigned'],['out_for_delivery','On the way'],['delivered','Delivered']];
const dateLabel=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)):'Date unavailable';

function CustomerOrders({rows=[]}){
 if(!rows.length)return <><Intro title="Your orders" copy="Your orders and delivery updates will show up here."/><Empty title="No orders yet" copy="Your next good find is waiting in the shop." link="/product"/></>;
 const spend=rows.reduce((sum,order)=>sum+(Number(order.totalAmount)||0),0);
 return <>
  <Intro title="Your orders" copy="Track your purchases, check each item, and follow delivery progress."/>
  <section className="orders-overview"><div><small>ORDERS PLACED</small><strong>{rows.length}</strong></div><div><small>TOTAL SPENT</small><strong>{money(spend)}</strong></div><a className="btn outline" href="/product">Continue shopping <span>↗</span></a></section>
  <div className="customer-orders-list">{rows.map(order=>{
   const orderId=id(order),products=order.products||[],subtotal=products.reduce((sum,line)=>sum+(Number(line.product?.price)||0)*(Number(line.quantity)||0),0),fee=Number(order.deliveryCharge??Math.max(0,(Number(order.totalAmount)||0)-subtotal)),stepIndex=steps.findIndex(([key])=>key===order.status),cancelled=order.status==='cancelled';
   return <article className="customer-order-card" key={orderId}>
    <header className="customer-order-head"><div><small>ORDER PLACED</small><b>{dateLabel(order.createdAt)}</b></div><div><small>ORDER NUMBER</small><b>#{orderId.slice(-8).toUpperCase()}</b></div><div className="customer-order-state"><small>STATUS</small><Status value={order.status}/></div></header>
    <section className={`order-progress${cancelled?' is-cancelled':''}`} aria-label={`Order status: ${order.status}`}>
     {cancelled?<><span className="progress-dot done">!</span><b>Order cancelled</b></>:steps.map(([key,label],index)=><div className={`progress-step${index<stepIndex?' done':''}${index===stepIndex?' current':''}`} key={key}><span className="progress-dot">{index<stepIndex?'✓':index+1}</span><small>{label}</small></div>)}
    </section>
    <div className="customer-order-body"><section className="customer-order-items"><div className="customer-order-subhead"><h2>Items in this order</h2><span>{products.reduce((sum,line)=>sum+(Number(line.quantity)||0),0)} items</span></div>{products.map((line,index)=>{
      const product=line.product||{};
      return <article className="customer-order-item" key={`${id(product)}-${index}`}><a className="customer-order-image" href={id(product)?`/product/${id(product)}`:'/product'}>{image(product)?<img src={image(product)} alt={product.name||'Product'}/>:<span>PP</span>}</a><div className="customer-order-product-name"><a href={id(product)?`/product/${id(product)}`:'/product'}>{product.name||'Product unavailable'}</a><small>Quantity: {line.quantity}</small></div><strong>{money((Number(product.price)||0)*(Number(line.quantity)||0))}</strong></article>;
     })}</section>
     <aside className="customer-order-summary"><small>PAYMENT SUMMARY</small><div><span>Items subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{fee?money(fee):'Free'}</b></div><div className="customer-order-total"><span>Order total</span><b>{money(order.totalAmount)}</b></div><div className="customer-payment-state"><span>Payment</span><b>{order.paymentProvider==='demo'?'Demo payment complete':order.paymentStatus?String(order.paymentStatus).replaceAll('_',' '):'Recorded'}</b></div><a className="mini-action customer-detail-link" href={`/orders/ordered/${orderId}/details`}>View order details <span>↗</span></a></aside>
    </div>
   </article>;
  })}</div>
 </>;
}

export default function OrdersPage({rows=[],path='/orders/ordered',submit}) {
 const customer=path==='/orders/ordered';
 return <main className={`section orders-page${customer?' customer-orders-page':''}`}>{customer?<CustomerOrders rows={rows}/>:<><Intro title={path.startsWith('/delivery')?'Delivery orders':'Orders'} copy="Review order details and follow each order as it moves."/>{rows.length?<OrderTable rows={rows} path={path} submit={submit}/>:<Empty title="No records yet" copy="When something needs your attention, it will appear here." link={path.startsWith('/admin')?undefined:'/product'}/>}</>}</main>;
}
