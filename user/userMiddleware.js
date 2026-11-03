const {reviewScheam}=require("../schema.js");
const Review=require("../models/review.js");
const review = require("../models/review.js");
const User=require("../models/user.js");

module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    if((req.get("accept")||"").toLowerCase().includes("application/json")){
      return res.status(401).json({redirect:"/users/login",error:"You need to be logged in to continue."});
    }
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



module.exports.isReviewOwner = async (req, res, next) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found or already deleted.");
        return res.redirect("/product");
    }

    const isOwner=review.owner&&review.owner.equals(req.user?._id);
    const isAdmin=req.user?.role==="admin";
    if (!isOwner&&!isAdmin) {
        req.flash("error", "Only the reviewer or an administrator can delete this review.");
        return res.redirect("/product");
    }

    next();
};



module.exports.isAddress=(req,res,next)=>{
  if(!Array.isArray(req.user?.address)||req.user.address.length===0){
    if((req.get("accept")||"").toLowerCase().includes("application/json")){
      return res.status(400).json({redirect:"/users/profile/location",error:"Add a delivery address before checkout."});
    }
    req.flash("error","You need to add address before perform this action");
    return res.redirect("/users/profile/location");
  }
  next();
}
