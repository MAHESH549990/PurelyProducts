const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const User=require("../../models/user.js");
const { isAdmin } = require("../adminmiddlerware.js");

router.get("/details",isAdmin,async(req,res)=>{
  let users=await User.find({role:{$in:"customer"}});
  res.render("routes/users.ejs",{users});
});

router.get("/details/:id",isAdmin,async(req,res)=>{
  let {id}=req.params;
  let users=await User.findById(id);
  let orders=await Order.find({customer:id}).populate("products.product");
  res.render("routes/usersDetails.ejs",{
    orders,
    users
  });
});

module.exports=router;