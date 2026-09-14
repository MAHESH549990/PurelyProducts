const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const User=require("../../models/user.js");

router.get("/details",async(req,res)=>{
  let users=await User.find();
  res.render("routes/users.ejs",{users});
});

//top products
router.get("/topOrders",async(req,res)=>{
  let products=await Product.find({rating:{$gt:4}});
  res.render("routes/topProducts.ejs",{products});
});

module.exports=router;