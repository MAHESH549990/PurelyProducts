const DELIVERY_EARNING_PER_ORDER=40;

function makeMonths(count=6,now=new Date()){
  return Array.from({length:count},(_,index)=>{
    const date=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-(count-1-index),1));
    return {key:`${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,"0")}`,label:new Intl.DateTimeFormat("en-IN",{month:"short",timeZone:"UTC"}).format(date),amount:0,orders:0,revenue:0,productCost:0,deliveryFees:0,deliveryPayout:0};
  });
}

function calculateAdminOrderProfit(order){
  if(order?.status!=="delivered")return {eligible:false,reason:"not-delivered"};
  const lines=order.products||[];
  if(!lines.length)return {eligible:false,reason:"missing-cost-snapshot"};
  let revenue=0,productCost=0;
  for(const line of lines){
    if(line.unitPriceAtPurchase===undefined||line.unitPriceAtPurchase===null||line.unitCostAtPurchase===undefined||line.unitCostAtPurchase===null)return {eligible:false,reason:"missing-cost-snapshot"};
    const quantity=Number(line.quantity),price=Number(line.unitPriceAtPurchase),cost=Number(line.unitCostAtPurchase);
    if(!Number.isFinite(quantity)||quantity<=0||!Number.isFinite(price)||!Number.isFinite(cost))return {eligible:false,reason:"missing-cost-snapshot"};
    revenue+=price*quantity;
    productCost+=cost*quantity;
  }
  const deliveryFees=Number(order.deliveryCharge)||0;
  const deliveryPayout=Number(order.deliveryEarnings)>0?Number(order.deliveryEarnings):DELIVERY_EARNING_PER_ORDER;
  return {eligible:true,revenue,productCost,deliveryFees,deliveryPayout,profit:revenue-productCost+deliveryFees-deliveryPayout};
}

function buildEarningsMetrics(orders=[],kind="admin",now=new Date()){
  const months=makeMonths(6,now),byMonth=new Map(months.map(month=>[month.key,month]));
  let totalEarnings=0,totalOrders=0,revenue=0,productCost=0,deliveryFees=0,deliveryPayout=0,missingCostOrders=0;
  for(const order of orders){
    let date,amount,details;
    if(kind==="delivery"){
      if(order.status!=="delivered")continue;
      amount=Number(order.deliveryEarnings)>0?Number(order.deliveryEarnings):DELIVERY_EARNING_PER_ORDER;
      date=order.deliveredAt||order.createdAt;
    }else{
      details=calculateAdminOrderProfit(order);
      if(!details.eligible){if(details.reason==="missing-cost-snapshot"&&order.status==="delivered")missingCostOrders+=1;continue;}
      amount=details.profit;
      date=order.deliveredAt||order.createdAt;
    }
    if(!date)continue;
    totalEarnings+=amount;
    totalOrders+=1;
    if(details?.eligible){revenue+=details.revenue;productCost+=details.productCost;deliveryFees+=details.deliveryFees;deliveryPayout+=details.deliveryPayout;}
    const value=new Date(date),key=`${value.getUTCFullYear()}-${String(value.getUTCMonth()+1).padStart(2,"0")}`,month=byMonth.get(key);
    if(month){month.amount+=amount;month.orders+=1;if(details?.eligible){month.revenue+=details.revenue;month.productCost+=details.productCost;month.deliveryFees+=details.deliveryFees;month.deliveryPayout+=details.deliveryPayout;}}
  }
  return {kind,totalEarnings,totalProfit:kind==="admin"?totalEarnings:undefined,totalOrders,rate:kind==="delivery"?DELIVERY_EARNING_PER_ORDER:null,revenue,productCost,deliveryFees,deliveryPayout,missingCostOrders,months};
}

module.exports={buildEarningsMetrics,calculateAdminOrderProfit,DELIVERY_EARNING_PER_ORDER};
