const {reviewScheam}=require("../schema.js");
const Review=require("../models/review.js");
const review = require("../models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.flash("error","You need to be logged in to perform this action");
    return res.redirect("/users/login");
  }
  next();
}

module.exports.validateReviews=(req,res,next)=>{
    let {error}=reviewScheam.validate(req.body);
    if(error){
      let errMsg=error.details.map((err)=>err.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    next();
}
module.exports.isReviewOwner=async(req,res,next)=>{
  let review=await Review.findById();
  if(!review.owner.equals(res.locals.currUser._id)){
    req.flash("error","Your are not the owner of this review");
    res.redirect("/product/")
  }
  next();
}
module.exports.isSignup=(req,res,next)=>{
  req.login(registeredUser,)
}