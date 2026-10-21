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

// View confirmed orders
router.get("/accepted", isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({
            status: "confirmed"
        })
            .populate("customer")
            .populate("products.product")
            .sort({ createdAt: -1 });

        res.render("routes/confirmedOrders.ejs", { orders });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to load confirmed orders.");
        res.redirect("/admin");
    }
});


// Show approved delivery partners for a particular order
router.get("/:id/assign-delivery", isAdmin, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            status: "confirmed"
        });

        if (!order) {
            req.flash("error", "Confirmed order not found.");
            return res.redirect("/admin/users/orders/accepted");
        }

        const deliveries = await Delivery.find({
            applicationStatus: "approved"
        }).populate("user", "username email");
        
        res.render("routes/approvedDeliveryDetails.ejs", {
            deliveries,
            order
        });
    } catch (err) {
        console.error("Assignment page error:", err);
        req.flash("error", "Unable to load delivery partners.");
        res.redirect("/admin/users/orders/accepted");
    }
});

// Assign an approved delivery partner to an order
router.post("/:id/assign-delivery", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      req.flash("error", "Order not found.");
      return res.redirect("/admin/users/orders/accepted");
    }

    if (order.status !== "confirmed") {
      req.flash("error", "Only confirmed orders can be assigned.");
      return res.redirect("/admin/users/orders/accepted");
    }

    const delivery = await Delivery.findOne({
      user: deliveryPartnerId,
      applicationStatus: "approved"
    });

    if (!delivery) {
      req.flash("error", "Approved delivery partner not found.");
      return res.redirect(
        `/admin/users/orders/${id}/assign-delivery`
      );
    }

    // Assign delivery partner and update status
    order.deliveryPartner = delivery.user;
    order.status = "assigned";

    await order.save();

    // Success flash message
    req.flash(
      "success",
      "Delivery partner assigned successfully! The order is now assigned."
    );

    return res.redirect("/admin/users/orders/accepted");

  } catch (err) {
    console.error("Assign delivery error:", err);

    req.flash("error", "Something went wrong while assigning the delivery partner.");

    return res.redirect("/admin/users/orders/accepted");
  }
});

module.exports=router;