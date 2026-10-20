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


// View all approved delivery partners
router.get("/approved", isAdmin, asyncWrap(async (req, res) => {
    const deliveries = await Delivery.find({
        applicationStatus: "approved"
    })
    .populate("user", "username email")
    .sort({ createdAt: -1 });

    res.render("routes/approvedDeliveryDetails.ejs", {
        deliveries
    });
}));

router.post("/:id/approve", isAdmin, asyncWrap(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
        req.flash("error", "Delivery application not found.");
        return res.redirect("/admin/delivery/requests");
    }

    delivery.applicationStatus = "approved";
    await delivery.save();

    req.flash("success", "Delivery partner approved successfully!");
    res.redirect("/admin/delivery/requests");
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