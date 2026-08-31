const express=require("express");
const router=express.Router({mergeParams:true});
const Product=require("../../models/products.js");
const Review=require("../../models/review.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {reviewScheam}=require("../../schema.js");


const validateReviews=(req,res,next)=>{
  let {error}=reviewScheam.validate(req.body);
  if(error){
    let errMsg=error.details.map((err)=>err.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  next();
}

router.post("/",validateReviews,asyncWrap(async(req,res)=>{
     let {id}=req.params;
     const newReview=await new Review(req.body.review);
     const product=await Product.findById(id);

     product.reviews.push(newReview);
     await newReview.save();
     await product.save();
     res.redirect(`/admin/products/${id}`);
}));

router.delete("/:reviewId",async(req,res)=>{
     let {reviewId,id}=req.params;
     await Product.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/admin/products/${id}`);
});

module.exports=router;