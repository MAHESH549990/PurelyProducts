const express = require("express");
const router=express.Router();
const mongoose = require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";

router.get("/" ,(req,res)=>{
  res.render("routes/deliveryDashboard.ejs");
});

module.exports=router;