const express = require("express");
const renderPage=require("../../utils/renderPage.js");
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
        }).populate("user","username email");

        const address = req.user.address?.[req.user.address.length-1] || {};

        renderPage(req,res,"routes/deliveryPartnerProfile.ejs", {
            username: req.user.username,
            email: req.user.email,
            deliveryPartner: deliveryPartner || {user:req.user},
            address,
            mapToken:process.env.MAP_TOKEN||""
        });

    } catch (err) {
        console.error("Delivery profile error:", err);
        req.flash("error", "Some delivery profile information could not be loaded.");
        const address = req.user?.address?.[req.user.address.length-1] || {};
        return renderPage(req,res,"routes/deliveryPartnerProfile.ejs",{
            username:req.user?.username,
            email:req.user?.email,
            deliveryPartner:{user:req.user},
            address,
            mapToken:process.env.MAP_TOKEN||""
        });
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
