const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const renderPage=require("../../utils/renderPage.js");
const {isAdmin}=require("../adminmiddlerware.js");

router.get("/",isAdmin,asyncWrap(async(req,res)=>{
  const products=await Product.find({}).sort({name:1});
  renderPage(req,res,"routes/inventory.ejs",{products});
}));

const updateStock=asyncWrap(async(req,res)=>{
  const stock=Number(req.body.stock);
  if(!Number.isInteger(stock)||stock<0){
    req.flash("error","Enter a whole-number stock quantity of zero or more.");
    return res.redirect("/admin/inventory");
  }
  const product=await Product.findByIdAndUpdate(req.params.id,{$set:{stock}},{new:true,runValidators:true});
  if(!product){
    req.flash("error","Product not found.");
    return res.redirect("/admin/inventory");
  }
  req.flash("success",`${product.name} stock updated to ${stock}.`);
  res.redirect("/admin/inventory");
});

// POST supports ordinary HTML form submissions; PUT remains available to API clients.
router.post("/:id/stock",isAdmin,updateStock);
router.put("/:id/stock",isAdmin,updateStock);

module.exports=router;
