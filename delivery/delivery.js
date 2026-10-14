const express = require("express");
const router=express.Router();
const mongoose = require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";
const assignOrder=require("./routes/ordersAssign.js");

router.get("/" ,(req,res)=>{
  res.render("routes/deliveryDashboard.ejs");
});

router.use("/orders",assignOrder);

module.exports=router;