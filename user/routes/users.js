const express = require("express");
const router=express.Router({mergeParams:true});
const Product = require("../../models/products.js");
const User = require("../../models/user.js");
const passport=require("passport");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {isLoggedIn}=require("../userMiddleware.js");
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
});

//profile
router.get("/profile/location",(req,res)=>{
  res.render("routes/userAddress.ejs");
});

router.post("/profile",isLoggedIn,asyncWrap(async(req,res)=>{
    let {state,city,location}=req.body;
    let id=req.user._id;
    let Useraddress=await User.findById(id);
    Useraddress.address.push({
      state:state,
      city:city,
      location:location
    });
    Useraddress.save();
    req.flash("success","Address added successfully");
    res.redirect("/users/profile");
}));

//Update route
router.get("/profile/:id/update",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let us=await User.findById(req.user._id);
  let userAddressArrays=us.address;
  let user=userAddressArrays.id(id);
  res.render("routes/updateAddress.ejs",{user,id});
}));

router.put("/profile/:id/update",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let {state,city,location}=req.body;
  let us=await User.findById(req.user._id);
  let userAddressArrays=us.address;
  let address=userAddressArrays.id(id);
  address.state=state;
  address.city=city;
  address.location=location;
  us.save();
  req.flash("success","Address updated successfully")
  res.redirect("/users/profile");
}));

router.delete("/profile/:id",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let us=await User.findById(req.user._id);
  let address=us.address;
  let newAddress=address.filter((item)=>{
    return item._id!=id;
  });
  us.address=newAddress;
  us.save();
  req.flash("success","Address Deleted");
  res.redirect("/users/profile");
}));

router.get("/profile",isLoggedIn,asyncWrap(async(req,res)=>{
  let user=req.user;
  let id=req.user._id;
  let address=await User.findById(id);
  let Useraddress=address.address;
  res.render("routes/profile.ejs",{user,Useraddress});
}));



router.get("/updatePassword", (req, res) => {
  res.render("userLogin/forgetPass.ejs");
});

module.exports=router;

