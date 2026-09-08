const express = require("express");
const router=express.Router({mergeParams:true});
const Product = require("../../models/products.js");
const User = require("../../models/user.js");
const passport=require("passport");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
//login,register route

router.get("/signup", (req, res) => {
  res.render("userLogin/signup.ejs");
});

router.post("/signup",asyncWrap(async(req,res)=>{
  try{
   let {username,email,password}=req.body;
   let newUser=new User({
    username:username,
    email:email
   });
   let registerdUser=await User.register(newUser,password);
   req.login(registerdUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Welcome to PurelyProducts");
   res.redirect("/product");
   });
  }
  catch(err){
    req.flash("error",err.message);
    res.redirect("/users/signup");
  }
}));


router.get("/login", (req, res) => {
  res.render("userLogin/login.ejs");
});

router.post("/login",
  passport.authenticate("local",{
    failureRedirect:"/users/login",
    failureFlash:true
  }),
  asyncWrap(async(req,res)=>{
     req.flash("success","Welcome back! to PurelyProducts");
     res.redirect("/product");
}));

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
     if(err){
          return next(err);
     }
     req.flash("success","You're logged out");
     res.redirect("/product");
  });
  console.log(req.user);
});



router.get("/updatePassword", (req, res) => {
  res.render("userLogin/forgetPass.ejs");
});

module.exports=router;

