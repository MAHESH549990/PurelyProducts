const express = require("express");
const router=express.Router();
const Product = require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const {isLoggedIn}=require("../userMiddleware.js");
const Cart=require("../../models/carts.js");

router.get("/ordered",isLoggedIn,asyncWrap(async(req,res)=>{
  let orders=await Order.find({customer:req.user._id}).populate("products.product").populate("customer");
  if(orders.length==0 || orders.length<=0){
     return res.render("routes/emptyOrders.ejs");
  }
  res.render("routes/userOrders.ejs",{orders});
}));

router.post("/ordered/:id/details",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let orders=await Order.findById(id).populate("products.product").populate("customer");
  res.render("routes/orderedProductDetails.ejs",{orders});
}));


module.exports=router;