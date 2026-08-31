const express = require("express");
const router=express.Router();
const Product = require("../../models/products.js");
//login,register route

router.get("/login", (req, res) => {
  res.render("userLogin/login.ejs");
})
router.get("/signup", (req, res) => {
  res.render("userLogin/signup.ejs");
});
router.get("/updatePassword", (req, res) => {
  res.render("userLogin/forgetPass.ejs");
});

//home route
router.get("/", async (req, res) => {
  const allProducts = await Product.find({});
  res.render("routes/home.ejs", { allProducts });
});

router.get("/:id", async (req, res) => {
    const item = await Product.findById(req.params.id).populate("reviews");
    res.render("routes/productDetails", { item });
});

module.exports=router;

