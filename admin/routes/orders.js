const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const User=require("../../models/user.js");
const { route } = require("./users.js");
const { isAdmin } = require("../adminmiddlerware.js");
const Delivery=require("../../models/delivery.js");



//top products
router.get("/top",isAdmin,async(req,res)=>{
  let products=await Product.find({rating:{$gt:4}});
  res.render("routes/topProducts.ejs",{products});
});

//see pending orders
router.get("/pending",isAdmin,async(req,res)=>{
  let orders=await Order.find({status:{$in:"placed"}}).populate("customer").populate("products.product");
  let users=await User.find();
  res.render("routes/pendingOrders.ejs",{orders,users});
})

// //Status of placed orders
router.patch("/confirmed/:id/accept",isAdmin,async(req,res)=>{
    let {id}=req.params;
    let order=await Order.findById(id);
    
      if (!order) {
            req.flash("error", "Order not found");
            return res.redirect("/admin/orders");
        }

        if (order.status !== "placed") {
            req.flash("error", "This order cannot be accepted");
            return res.redirect("/admin/orders");
        }

        order.status = "confirmed";
        await order.save();

    req.flash("success", "Order accepted successfully!");
    res.redirect("/admin/users/orders/pending");
 });


 router.get("/accepted",isAdmin,async(req,res)=>{
    let orders=await Order.find({status:{$in:"confirmed"}}).populate("customer").populate("products.product");
    res.render("routes/confirmedOrders.ejs",{orders});
 })

 router.get(("/:id/assign-delivery"),async(req,res)=>{
     const deliveries=await Delivery.find();
     res.render("routes/approvedDeliveryDetails.ejs",{deliveries});
 })

module.exports=router;