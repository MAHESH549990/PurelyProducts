const express = require("express");
const router = express.Router({ mergeParams: true });
const Product = require("../../models/products.js");
const Cart=require("../../models/carts.js");

// router.get("/cart/place",async(req,res)=>{
//    let user=req.user._id;
//    let totalCartProducts=await Cart.findById({user:user}).populate("items.product");
//    console.log(totalCartProducts);
//    res.send("item are placed");
// });

module.exports=router;

