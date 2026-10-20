const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const Order=require("../../models/orders.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const User=require("../../models/user.js");
const { isAdmin } = require("../adminmiddlerware.js");
const Delivery = require("../../models/delivery.js");

router.get("/partners",isAdmin,(req,res)=>{
  res.render("routes/deliveryboys.ejs");
});

router.get("/partners/new",isAdmin,(req,res)=>{
  res.render("routes/addDeliveryPartner.ejs");
});


// View delivery applications
router.get("/applications", isAdmin, async (req, res) => {
    try {
        const applications = await Delivery.find({})
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        res.render("routes/deliveryboys.ejs", {
            applications
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to load delivery applications.");
        res.redirect("/admin");
    }
});


// View new delivery requests
router.get("/requests", isAdmin, async (req, res) => {
    try {
        const deliveries = await Delivery.find({
            applicationStatus: "pending"
        })
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        res.render("routes/newDeliveryRequests.ejs", {
            deliveries
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to load delivery requests.");
        res.redirect("/admin");
    }
});

module.exports=router;