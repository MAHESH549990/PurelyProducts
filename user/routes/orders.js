const express = require("express");
const renderPage=require("../../utils/renderPage.js");
const router=express.Router();
const Product = require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const {isLoggedIn,isAddress}=require("../userMiddleware.js");
const Cart=require("../../models/carts.js");

router.get("/ordered",isLoggedIn,asyncWrap(async(req,res)=>{
  let orders=await Order.find({customer:req.user._id}).populate("products.product").populate("customer").sort({createdAt:-1});
  if(orders.length==0 || orders.length<=0){
     return renderPage(req,res,"routes/emptyOrders.ejs");
  }
  renderPage(req,res,"routes/userOrders.ejs",{orders});
}));

const renderCustomerOrderDetails=async(req,res)=>{
  const order=await Order.findOne({_id:req.params.id,customer:req.user._id}).populate("products.product").populate("customer");
  if(!order){
    req.flash("error","That order could not be found in your account.");
    return res.redirect("/orders/ordered");
  }
  renderPage(req,res,"routes/orderedProductDetails.ejs",{orders:order});
};

router.get("/ordered/:id/details",isLoggedIn,asyncWrap(renderCustomerOrderDetails));
// Keep the old form endpoint working while older cached React bundles expire.
router.post("/ordered/:id/details",isLoggedIn,asyncWrap(renderCustomerOrderDetails));


module.exports=router;
