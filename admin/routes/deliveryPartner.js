const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const User=require("../../models/user.js");
const { isAdmin } = require("../adminmiddlerware.js");


router.get("/partners",isAdmin,(req,res)=>{
  res.render("routes/deliveryboys.ejs");
});

router.get("/partners/new",isAdmin,(req,res)=>{
  res.render("routes/addDeliveryPartner.ejs");
});

module.exports=router;