const express = require("express");
const router=express.Router({mergeParams:true});
const Product = require("../../models/products.js");
const Review=require("../../models/review.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {isLoggedIn,validateReviews}=require("../userMiddleware.js");


router.post("/",isLoggedIn,validateReviews,asyncWrap(async(req,res)=>{
     let {id}=req.params;
     const newReview=await new Review(req.body.review);
     newReview.owner=req.user._id;
     const product=await Product.findById(id);
    
     product.reviews.push(newReview);
     req.flash("success","Review added")
     await newReview.save();
     await product.save();
     res.redirect(`/product/${id}`);
}));

router.delete("/:reviewId",isLoggedIn,async(req,res)=>{
     let {reviewId,id}=req.params;
     req.flash("success","Review Deleted");
     await Product.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/product/${id}`);
});


module.exports=router;