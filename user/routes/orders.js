const express = require("express");
const router = express.Router({ mergeParams: true });
const Product = require("../../models/products.js");
const Cart=require("../../models/carts.js");
const UserAddress=require("../../models/userAddress.js");

//address route
router.get("/profile/location",(req,res)=>{
  res.render("routes/userAddress.ejs");
});

router.post("/profile",async(req,res)=>{
    let address=await UserAddress.insertOne(req.body);
    address.save();
    req.flash("success","Address added successfully");
    res.redirect("/users/profile");
});


module.exports=router;

