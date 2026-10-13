const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const User=require("../../models/user.js");



//top products
router.get("/top",async(req,res)=>{
  let products=await Product.find({rating:{$gt:4}});
  res.render("routes/topProducts.ejs",{products});
});

//see pending orders
router.get("/pending",async(req,res)=>{
  let orders=await Order.find({status:{$in:"placed"}});
  res.render("routes/pendingOrders.ejs",{orders});
})

// //Status of placed orders
// router.patch("/accept",(req,res)=>{

// })

module.exports=router;