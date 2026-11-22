const express = require("express");
const renderPage=require("../utils/renderPage.js");
const router=express.Router();
const deliveryPartner=require("./routes/deliveryUser.js");
const requireDeliveryPartner = require("./requireDeliveryPartner.js");
const Order=require("../models/orders.js");
const Delivery=require("../models/delivery.js");
const asyncWrap=require("../utils/asyncWrap.js");
const {buildEarningsMetrics}=require("../utils/earningsMetrics.js");

async function partnerOrderIds(userId){
  const delivery=await Delivery.findOne({user:userId}).select("_id").lean();
  return delivery?[userId,delivery._id]:[userId];
}

router.get("/earnings",requireDeliveryPartner,asyncWrap(async(req,res)=>{
  const ids=await partnerOrderIds(req.user._id);
  const orders=await Order.find({deliveryPartner:{$in:ids},status:"delivered"})
    .populate("customer","username email")
    .populate("products.product","name price")
    .sort({deliveredAt:-1,createdAt:-1});
  renderPage(req,res,"routes/deliveryEarnings.ejs",{
    earnings:buildEarningsMetrics(orders,"delivery"),
    orders
  });
}));
router.get("/",requireDeliveryPartner,asyncWrap(async(req,res)=>{
  const ids=await partnerOrderIds(req.user._id);
  const orders=await Order.find({deliveryPartner:{$in:ids},status:"delivered"}).select("status deliveryEarnings deliveredAt createdAt").lean();
  renderPage(req,res,"routes/deliveryDashboard.ejs",{earnings:buildEarningsMetrics(orders,"delivery")});
}));

router.use("/person",deliveryPartner);

module.exports=router;
