const {reviewScheam}=require("../schema.js");
const Review=require("../models/review.js");
const review = require("../models/review.js");
const User=require("../models/user.js");

module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        req.flash("error", "You don't have permission to access this page.");
        return res.redirect("/product");
    }

    next();
};