const express = require("express");
const router=express.Router();
const Product = require("../../models/products.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {isLoggedIn}=require("../userMiddleware.js");
const Cart=require("../../models/carts.js");
const User=require("../../models/user.js");

//home route
router.get("/", asyncWrap(async (req, res) => {
  const allProducts = await Product.find({});
  res.render("routes/home.ejs", { allProducts });
}));

//payment route
router.get("/cart/place",(req,res)=>{
   res.render("routes/cardPayment.ejs");
});



router.get("/cart",isLoggedIn,asyncWrap(async(req,res)=>{
  let cartItems = await Cart.findOne({
      user: req.user._id
  }).populate("items.product");
  if(!cartItems || cartItems.items.length==0){
    return res.render("routes/noItemCart.ejs");
  }
  let totalProducts = 0;
  let totalProductsPrice = 0;

  for(let i = 0; i < cartItems.items.length; i++) {
      totalProductsPrice+=cartItems.items[i].product.price*cartItems.items[i].quantity;
      let item=0;
      for(let j=1;j<=cartItems.items[i].quantity;j++)
      {
        item++;
      }
      totalProducts+=item;
    }
  res.render("routes/cart.ejs",
  {
    cartItems,
    totalProducts,
    totalProductsPrice
  });
}));


router.get("/:id", asyncWrap(async (req, res) => {
    const item = await Product.findById(req.params.id).populate("reviews");
    res.render("routes/productDetails", { item });
}));



//cart
router.post("/:id/cart",isLoggedIn,asyncWrap(async(req,res)=>{
   let {id}=req.params;
   let quantity=req.body.quantity;
   let cart=await Cart.findOne({user:req.user._id});
   if(!cart){
     cart=await Cart.insertOne({
         user:req.user._id,
         items:{
            product:id,
            quantity:quantity
         }
     });
   }else{
     cart.items.push({
      product:id,
      quantity:quantity
     });

     await cart.save();
   }
   req.flash("success","Item added to cart");
   res.redirect("/product");
}));


//delete item form cart 

router.delete("/cart/:id", async (req, res) => {
    let { id } = req.params;
    let cart=await Cart.findOne({user:req.user._id});
    await Cart.findByIdAndUpdate(cart._id,{$pull:{items:{product:id}}});
    req.flash("success","Product deleted form cart");
    res.redirect("/product/cart");
});

module.exports=router;