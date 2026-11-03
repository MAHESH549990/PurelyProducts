const express = require("express");
const renderPage=require("../utils/renderPage.js");
const router=express.Router();
const deliveryPartner=require("./routes/deliveryUser.js");
const requireDeliveryPartner = require("./requireDeliveryPartner.js");
const Order=require("../models/orders.js");
const asyncWrap=require("../utils/asyncWrap.js");
const {buildEarningsMetrics}=require("../utils/earningsMetrics.js");

router.get("/",requireDeliveryPartner,asyncWrap(async(req,res)=>{
  const orders=await Order.find({deliveryPartner:req.user._id,status:"delivered"}).select("status deliveryEarnings deliveredAt createdAt").lean();
  renderPage(req,res,"routes/deliveryDashboard.ejs",{earnings:buildEarningsMetrics(orders,"delivery")});
}));

router.use("/person",deliveryPartner);

module.exports=router;
