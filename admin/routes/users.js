const express=require("express");
const renderPage=require("../../utils/renderPage.js");
const router=express.Router();
const Product=require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const User=require("../../models/user.js");
const { isAdmin } = require("../adminmiddlerware.js");

router.get("/details",isAdmin,asyncWrap(async(req,res)=>{
  const users=await User.find({role:"customer"}).select("username email role address createdAt").sort({createdAt:-1}).lean();
  const customerIds=users.map(user=>user._id);
  const orderStats=customerIds.length?await Order.aggregate([
    {$match:{customer:{$in:customerIds}}},
    {$group:{_id:"$customer",orders:{$sum:1},spend:{$sum:{$ifNull:["$totalAmount",0]}},delivered:{$sum:{$cond:[{$eq:["$status","delivered"]},1,0]}}}}
  ]):[];
  const customerStats=Object.fromEntries(orderStats.map(stat=>[String(stat._id),stat]));
  renderPage(req,res,"routes/users.ejs",{users,customerStats});
}));

router.get("/details/:id",isAdmin,asyncWrap(async(req,res)=>{
  const customer=await User.findById(req.params.id).select("username email role address createdAt");
  const orders=await Order.find({customer:req.params.id}).populate("products.product").sort({createdAt:-1});
  renderPage(req,res,"routes/usersDetails.ejs",{
    orders,
    users:customer,
    customer,
    mapToken:process.env.MAP_TOKEN||""
  });
}));
module.exports=router;
