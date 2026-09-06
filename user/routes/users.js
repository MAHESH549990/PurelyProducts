const express = require("express");
const router=express.Router();
const Product = require("../../models/products.js");
const User = require("../../models/user.js");
const passport=require("passport");
//login,register route

router.get("/signup", (req, res) => {
  res.render("userLogin/signup.ejs");
});

router.post("/signup",async(req,res)=>{
   let {username,email,password}=req.body;
   let newUser=new User({
    username:username,
    email:email
   });
   await User.register(newUser,password);
   req.flash("success","Welcome to PurelyProducts");
   res.redirect("/users");
});


router.get("/login", (req, res) => {
  res.render("userLogin/login.ejs");
});

router.post("/login",
  passport.authenticate("local",{
    failureRedirect:"/users/login",
    failureFlash:true
  }),
  async(req,res)=>{
     req.flash("success","Welcome back! to PurelyProducts");
     res.redirect("/users");
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

