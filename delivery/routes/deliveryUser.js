const express = require("express");
const router = express.Router();
const Delivery = require("../../models/delivery.js");
const requireDeliveryPartner = require("../requireDeliveryPartner.js");

router.get("/profile", requireDeliveryPartner,async (req, res) => {
    try {
        // Check whether the user is logged in
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            req.flash("error", "Please log in first.");
            return res.redirect("/users/login");
        }

        const deliveryPartner = await Delivery.findOne({
            user: req.user._id
        });

        if (!deliveryPartner) {
            req.flash("error", "Delivery partner profile not found.");
            return res.redirect("/delivery");
        }

        const address = req.user.address?.[0] || {};

        res.render("routes/deliveryPartnerProfile.ejs", {
            username: req.user.username,
            email: req.user.email,
            deliveryPartner,
            address
        });

    } catch (err) {
        console.error("Delivery profile error:", err);
        req.flash("error", "Unable to load delivery partner profile.");
        return res.redirect("/delivery");
    }
});

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
     if(err){
          return next(err);
     }
     req.flash("success","You're logged out");
     res.redirect("/users/login");
  });
});

module.exports=router;