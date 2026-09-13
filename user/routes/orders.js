const express = require("express");
const router=express.Router();
const Product = require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const {isLoggedIn}=require("../userMiddleware.js");
const Cart=require("../../models/carts.js");

router.get("/ordered",async(req,res)=>{
  let orders=await Order.find({customer:req.user._id}).populate("products.product").populate("customer");
  console.log(orders);
  res.render("routes/userOrders.ejs",{orders});
});

router.get("/ordered/details",async(req,res)=>{
  let orders=await Order.find({customer:req.user._id}).populate("products.product").populate("customer");
  res.render("routes/orderedProductDetails.ejs",{orders});
});


module.exports=router;