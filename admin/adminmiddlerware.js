const {reviewScheam}=require("../schema.js");
const Review=require("../models/review.js");
const review = require("../models/review.js");
const User=require("../models/user.js");
const renderPage=require("../utils/renderPage.js");

module.exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401);
        return renderPage(req,res,"routes/error.ejs",{message:"Please sign in with an administrator account to open this page.",status:401});
    }
    if (req.user.role !== "admin") {
        res.status(403);
        return renderPage(req,res,"routes/error.ejs",{message:"This account does not have administrator access. Sign in with an administrator account.",status:403});
    }

    next();
};
