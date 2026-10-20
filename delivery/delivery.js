const express = require("express");
const router=express.Router();
const assignOrder=require("./routes/ordersAssign.js");

router.get("/" ,(req,res)=>{
  res.render("routes/deliveryDashboard.ejs");
});

router.use("/orders",assignOrder);

module.exports=router;