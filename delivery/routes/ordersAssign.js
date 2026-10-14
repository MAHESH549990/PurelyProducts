const express = require("express");
const router=express.Router();
const Product = require("../../models/products.js");
const Order=require("../../models/orders.js");
const User=require("../../models/user.js");
// const asyncWrap=require("../../utils/asyncWrap.js");
// const {isLoggedIn,isAddress}=require("../userMiddleware.js");
// const Cart=require("../../models/carts.js");
// const { populate } = require("../../models/user.js");

router.get("/assign",async(req,res)=>{
  let orders=await Order.find({status:{$in:"confirmed"}}).populate("customer").populate("products.product");
  res.render("routes/assignedOrders.ejs",{orders});
});


//out of delivery 
router.get("/assign/out-for-delivery",async(req,res)=>{
  let orders=await Order.find({status:{$in:"out_for_delivery"}}).populate("products.product").populate("customer");
  res.render("routes/outOfDeliveryOrders.ejs",{orders});
});


//assigned orderss
router.get("/assign/:id",async(req,res)=>{
  let {id}=req.params;
  let order=await Order.findById(id).populate("products.product").populate("customer");
  let user=await User.find({_id:{$in:order.customer._id}})
  console.log(user);
  res.render("routes/assignProductDetails.ejs",{order});
});

router.patch("/assign/:id/out-for-delivery",async(req,res)=>{
    let {id}=req.params;
    let order=await Order.findById(id);
  
    if (!order) {
          req.flash("error", "Order not found");
          return res.redirect("/delivery");
      }

      if (order.status !== "confirmed") {
          req.flash("error", "This order cannot be accepted");
          return res.redirect("/delivery");
      }

      order.status = "out_for_delivery";
      await order.save();

     req.flash("success", "Order out-for-delivery!");
     res.redirect("/delivery");
});

module.exports=router;