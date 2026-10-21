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


// View all approved delivery partners
router.get("/approved", isAdmin, asyncWrap(async (req, res) => {
    const deliveries = await Delivery.find({
        applicationStatus: "approved"
    })
        .populate("user", "username email")
        .sort({ createdAt: -1 });

    let order = null;

    if (req.query.orderId) {
        order = await Order.findById(req.query.orderId);

        if (!order) {
            req.flash("error", "Order not found.");
            return res.redirect("/admin/orders/pending");
        }
    }

    res.render("routes/approvedDeliveryDetails.ejs", {
        deliveries,
        order
    });
}));



router.post("/:id/approve", isAdmin, asyncWrap(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
        req.flash("error", "Delivery application not found.");
        return res.redirect("/admin/delivery/requests");
    }

    // Only pending applications can be approved
    if (delivery.applicationStatus !== "pending") {
        req.flash("error", "This application has already been processed.");
        return res.redirect("/admin/delivery/requests");
    }

    // Find the associated user
    const user = await User.findById(delivery.user);

    if (!user) {
        req.flash("error", "Associated user account not found.");
        return res.redirect("/admin/delivery/requests");
    }

    // Update the user's role
    user.role = "delivery";
    await user.save();

    // Approve the delivery application
    delivery.applicationStatus = "approved";
    await delivery.save();

    req.flash(
        "success",
        `${user.username} is now an approved delivery partner!`
    );

    return res.redirect("/admin/delivery/requests");
}));


// View one approved delivery partner's details
router.get(
    "/approved/:id",
    isAdmin,
    asyncWrap(async (req, res) => {
        const delivery = await Delivery.findOne({
            _id: req.params.id,
            applicationStatus: "approved"
        }).populate("user", "username email");

        if (!delivery) {
            req.flash("error", "Approved delivery partner not found.");
            return res.redirect("/admin/delivery/approved");
        }

        res.render("routes/approvedDeliveryBoyDetails.ejs", {
            delivery
        });
    })
);

//rejext request of the delivery partner 
router.post("/requests/:id/reject", isAdmin, asyncWrap(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
        req.flash("error", "Delivery application not found.");
        return res.redirect("/admin/delivery/requests");
    }

    if (delivery.applicationStatus !== "pending") {
        req.flash("error", "This application has already been processed.");
        return res.redirect("/admin/delivery/requests");
    }

    delivery.applicationStatus = "rejected";
    await delivery.save();

    req.flash("success", "Delivery partner application rejected successfully!");

    return res.redirect("/admin/delivery/requests");
}));

// View a delivery partner's private licence document
router.get(
    "/:id/license",
    isAdmin,
    asyncWrap(async (req, res) => {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery || !delivery.licenseImage?.url) {
            req.flash("error", "Licence document not found.");
            return res.redirect("/admin/delivery/approved");
        }

        // Redirect to the stored URL for now.
        // Note: authenticated Cloudinary raw files may not open
        // directly without a signed URL or server-side delivery.
        return res.redirect(delivery.licenseImage.url);
    })
);

module.exports=router;