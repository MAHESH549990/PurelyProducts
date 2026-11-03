const ADMIN_BENEFIT_PER_ORDER=30;
const DELIVERY_EARNING_PER_ORDER=40;

function makeMonths(count=6,now=new Date()){
  return Array.from({length:count},(_,index)=>{
    const date=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-(count-1-index),1));
    return {key:`${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,"0")}`,label:new Intl.DateTimeFormat("en-IN",{month:"short",timeZone:"UTC"}).format(date),amount:0,orders:0};
  });
}

function buildEarningsMetrics(orders=[],kind="admin",now=new Date()){
  const months=makeMonths(6,now),byMonth=new Map(months.map(month=>[month.key,month]));
  let totalEarnings=0,totalOrders=0;
  for(const order of orders){
    let amount,date;
    if(kind==="delivery"){
      if(order.status!=="delivered")continue;
      amount=Number(order.deliveryEarnings)>0?Number(order.deliveryEarnings):DELIVERY_EARNING_PER_ORDER;
      date=order.deliveredAt||order.createdAt;
    }else{
      if(!order.assignedAt&&!["assigned","out_for_delivery","delivered"].includes(order.status))continue;
      amount=Number(order.adminProfit)>0?Number(order.adminProfit):ADMIN_BENEFIT_PER_ORDER;
      date=order.assignedAt||order.createdAt;
    }
    if(!date)continue;
    totalEarnings+=amount;
    totalOrders+=1;
    const value=new Date(date),key=`${value.getUTCFullYear()}-${String(value.getUTCMonth()+1).padStart(2,"0")}`,month=byMonth.get(key);
    if(month){month.amount+=amount;month.orders+=1;}
  }
  return {kind,totalEarnings,totalOrders,rate:kind==="delivery"?DELIVERY_EARNING_PER_ORDER:ADMIN_BENEFIT_PER_ORDER,months};
}

module.exports={buildEarningsMetrics,ADMIN_BENEFIT_PER_ORDER,DELIVERY_EARNING_PER_ORDER};
