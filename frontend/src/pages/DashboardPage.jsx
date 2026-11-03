import React from 'react';
import {money} from './ui';

function EarningsGraph({metrics,delivery}){
 if(!metrics)return null;
 const months=metrics.months||[],values=months.map(month=>Number(month.amount)||0),max=Math.max(...values,1),left=50,right=660,top=22,bottom=154,span=right-left;
 const points=values.map((value,index)=>`${left+(months.length<2?0:index*span/(months.length-1))},${bottom-(value/max)*(bottom-top)}`).join(' ');
 const title=delivery?'Delivery earnings':'Admin profit';
 return <section className="earnings-panel" id="earnings"><div className="earnings-heading"><div><small>{delivery?'DELIVERY PARTNER · PAYOUTS':'ADMIN · ORDER BENEFIT'}</small><h2>{title}</h2><p>{delivery?`₹${metrics.rate} per completed order, regardless of item count.`:`₹${metrics.rate} benefit for each assigned order.`}</p></div><div className="earnings-total"><small>ALL TIME</small><b>{money(metrics.totalEarnings)}</b><span>{metrics.totalOrders} qualifying orders</span></div></div><div className="earnings-chart-wrap"><svg className="earnings-chart" viewBox="0 0 700 205" role="img" aria-label={`${title} for the last six months`}><line x1="40" y1="22" x2="40" y2="154"/><line x1="40" y1="154" x2="675" y2="154"/><line x1="40" y1="88" x2="675" y2="88"/><line x1="40" y1="22" x2="675" y2="22"/>{months.length>0&&<><polyline points={points}/>{values.map((value,index)=>{const x=left+(months.length<2?0:index*span/(months.length-1)),y=bottom-(value/max)*(bottom-top);return <g key={months[index].key}><circle cx={x} cy={y} r="4"/><text x={x} y="178" textAnchor="middle">{months[index].label}</text></g>})}</>}</svg></div></section>;
}

export default function DashboardPage({path,user,data={}}) {
 const admin=path.startsWith('/admin'),delivery=path.startsWith('/delivery'),earnings=data.earnings;
 const cards=admin?[['Products','/admin/products'],['Orders to review','/admin/users/orders/pending'],['Confirmed orders','/admin/users/orders/accepted'],['Inventory','/admin/inventory']]:delivery?[['Assigned orders','/delivery/orders/assign'],['On route','/delivery/orders/assign/out-for-delivery'],['Delivery history','/delivery/orders/assign/delivered'],['Your profile','/delivery/person/profile']]:[['Explore the shop','/product'],['Your orders','/orders/ordered'],['Your account','/users/profile']];
 return <main className="dashboard"><section className="welcome"><small>{admin?'PURELYPRODUCTS · ADMIN':delivery?'DELIVERY PARTNER SPACE':'WELCOME TO PURELYPRODUCTS'}</small><h1>{admin?'Your shop, at a glance':delivery?'Your delivery day':'A little good, every day.'}</h1><p>{user?.username?`Good to see you, ${user.username}.`:'Thoughtful finds for the everyday.'}</p></section><div className="dash-cards">{cards.map(([name,href],i)=><a className="dash-card" href={href} key={href}><small>0{i+1}</small><b>{name}</b><span>↗</span><p>{admin&&href==='/admin/inventory'?`${data.inventoryCount??0} products · ${data.lowStockCount??0} low stock`:name==='Delivery history'&&earnings?`${earnings.totalOrders} orders · ${money(earnings.totalEarnings)} earned`:`Open ${name.toLowerCase()}`}</p></a>)}</div>{(admin||delivery)&&<EarningsGraph metrics={earnings} delivery={delivery}/>}</main>;
}
