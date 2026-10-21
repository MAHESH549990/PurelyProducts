const express = require("express");
const router=express.Router();
const assignOrder=require("./routes/ordersAssign.js");
const deliveryPartner=require("./routes/deliveryUser.js");
const requireDeliveryPartner = require("./requireDeliveryPartner.js");

router.get("/" ,requireDeliveryPartner,(req,res)=>{
  res.render("routes/deliveryDashboard.ejs");
});

router.use("/orders",assignOrder);
router.use("/person",deliveryPartner);

module.exports=router;