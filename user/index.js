const express = require("express");
const router=express.Router({mergeParams:true});
let reviews=require("./routes/reviews.js");
let users=require("./routes/users.js");
let product=require("./routes/porduct.js");
let orders=require("./routes/orders.js");


router.get("/", (req, res) => {
    console.log("USER INSIDE USER INDEX:", req.user);
    res.send("You're in the home page");
});

//users
router.use("/users",users);
// products
//reviews
router.use("/users/:id/reviews",reviews);

module.exports=router;
