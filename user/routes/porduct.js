const express = require("express");
const router=express.Router();
const Product = require("../../models/products.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");

//home route
router.get("/", asyncWrap(async (req, res) => {
  const allProducts = await Product.find({});
  res.render("routes/home.ejs", { allProducts });
}));

router.get("/:id", asyncWrap(async (req, res) => {
    const item = await Product.findById(req.params.id).populate("reviews");
    res.render("routes/productDetails", { item });
}));

router.get("/:id/place",async(req,res)=>{
  let {id}=req.params;
  const item=await Product.findById(id);
  res.render("routes/productDetails2.ejs",{item});
})

module.exports=router;