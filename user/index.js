const express = require("express");
const router=express.Router({mergeParams:true});
let reviews=require("./routes/reviews.js");
let users=require("./routes/users.js");
let product=require("./routes/porduct.js");
const orders = require("./routes/orders.js");


router.get("/", (req, res) => {
    res.render("userLogin/login.ejs");
});

//orders
router.use("/orders",orders);
//users
router.use("/users",users);
//reviews
router.use("/users/:id/reviews",reviews);

module.exports=router;
