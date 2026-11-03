const express = require("express");
const renderPage=require("../../utils/renderPage.js");
const router=express.Router();
const Product = require("../../models/products.js");
const Order=require("../../models/orders.js");
const User=require("../../models/user.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const {isLoggedIn,isAddress}=require("../userMiddleware.js");
const Cart=require("../../models/carts.js");
const Review=require("../../models/review.js");
const { populate } = require("../../models/user.js");
const crypto=require("node:crypto");

const FREE_DELIVERY_THRESHOLD=299;
const LOW_VALUE_DELIVERY_CHARGE=35;
function summarizeCart(cartItems){
  const validItems=(cartItems?.items||[]).filter(entry=>entry.product);
  const totalProducts=validItems.reduce((sum,entry)=>sum+(Number(entry.quantity)||0),0);
  const totalProductsPrice=validItems.reduce((sum,entry)=>sum+(Number(entry.product.price)||0)*(Number(entry.quantity)||0),0);
  const deliveryCharge=totalProductsPrice<FREE_DELIVERY_THRESHOLD?LOW_VALUE_DELIVERY_CHARGE:0;
  return {validItems,totalProducts,totalProductsPrice,deliveryCharge,orderTotal:totalProductsPrice+deliveryCharge};
}

//home route
router.get("/", asyncWrap(async (req, res) => {
  const allProducts = await Product.find({});
  renderPage(req,res,"routes/home.ejs", { allProducts });
}));


// The checkout currently runs in demo mode and never contacts a payment provider.
router.post("/cart/place", isLoggedIn,isAddress,(req,res)=>res.redirect(303,"/product/cart/place"));

router.post("/cart/payment-session",isLoggedIn,isAddress,asyncWrap(async(req,res)=>{
  const cart=await Cart.findOne({user:req.user._id}).populate("items.product");
  const totals=summarizeCart(cart);
  if(!totals.validItems.length) return res.status(400).json({error:"Your cart is empty. Add a product before checkout."});
  const demoSessionId=crypto.randomUUID();
  req.session.pendingDemoPayment={
    sessionId:demoSessionId,
    userId:String(req.user._id),
    expiresAt:Date.now()+20*60*1000,
    products:totals.validItems.map(entry=>({product:String(entry.product._id),quantity:Number(entry.quantity)})),
    totalProductsPrice:totals.totalProductsPrice,
    deliveryCharge:totals.deliveryCharge,
    orderTotal:totals.orderTotal
  };
  res.json({demoSessionId,amount:totals.orderTotal,currency:"INR",mode:"demo"});
}));

router.post("/cart/payment/complete",isLoggedIn,asyncWrap(async(req,res)=>{
  const {demoSessionId,cardholderName}=req.body||{};
  if(!demoSessionId) return res.status(400).json({error:"Demo payment session is missing."});
  if(typeof cardholderName!=="string"||!cardholderName.trim()||cardholderName.trim().length>80) return res.status(400).json({error:"Enter a valid cardholder name for the demo payment."});
  const paymentId=`demo_${demoSessionId}`;
  const alreadyPlaced=await Order.findOne({paymentId,customer:req.user._id});
  if(alreadyPlaced){delete req.session.pendingDemoPayment;req.flash("success","Items placed successfully");return res.json({success:true,redirect:"/orders/ordered"});}
  const pending=req.session.pendingDemoPayment;
  if(!pending||pending.sessionId!==demoSessionId||pending.userId!==String(req.user._id)||pending.expiresAt<Date.now()){
    delete req.session.pendingDemoPayment;
    return res.status(400).json({error:"This demo payment session expired. Your cart is still available; please retry."});
  }
  const savedAddress=req.user.address?.[req.user.address.length-1];
  const deliveryAddress=savedAddress?{location:savedAddress.location,city:savedAddress.city,state:savedAddress.state}:undefined;
  const reserved=[];
  let placed;
  try{
    for(const line of pending.products){
      const quantity=Number(line.quantity)||0;
      await Product.updateOne({_id:line.product,stock:{$exists:false}},{$set:{stock:100}});
      const updated=await Product.findOneAndUpdate({_id:line.product,stock:{$gte:quantity}},{$inc:{stock:-quantity}},{new:true});
      if(!updated)throw Object.assign(new Error("A product in your cart no longer has enough stock. Your cart has been kept."),{status:409});
      reserved.push({product:line.product,quantity});
    }
    placed=await Order.create({customer:req.user._id,products:pending.products,totalAmount:pending.orderTotal,deliveryCharge:pending.deliveryCharge,deliveryAddress,paymentProvider:"demo",paymentId,paymentOrderId:demoSessionId,paymentStatus:"paid"});
  }catch(error){
    await Promise.all(reserved.map(line=>Product.updateOne({_id:line.product},{$inc:{stock:line.quantity}}).catch(()=>null)));
    if(error.status===409)return res.status(409).json({error:error.message});
    throw error;
  }
  // Clear only the cart contents represented by this demo checkout session.
  const current=await Cart.findOne({user:req.user._id});
  const currentItems=(current?.items||[]).map(entry=>({product:String(entry.product),quantity:Number(entry.quantity)})).sort((a,b)=>a.product.localeCompare(b.product));
  const paidItems=[...pending.products].sort((a,b)=>a.product.localeCompare(b.product));
  if(JSON.stringify(currentItems)===JSON.stringify(paidItems)) await Cart.findOneAndDelete({user:req.user._id}).catch(error=>console.error("Unable to clear cart after order",error.message));
  delete req.session.pendingDemoPayment;
  req.flash("success","Items placed successfully");
  res.json({success:true,redirect:"/orders/ordered",orderId:String(placed._id)});
}));


//orders
router.get("/cart/place",isLoggedIn,isAddress,asyncWrap(async(req,res)=>{
  const cartItems=await Cart.findOne({user:req.user._id}).populate("items.product");
  const totals=summarizeCart(cartItems);
  if(!totals.validItems.length){
    if((req.get("accept")||"").toLowerCase().includes("application/json")) return res.status(400).json({redirect:"/product/cart",error:"Your cart is empty. Add a product before checkout."});
    req.flash("error","Your cart is empty. Add a product before checkout.");
    return res.redirect("/product/cart");
  }
  const checkoutItems=totals.validItems.map(entry=>({
    quantity:entry.quantity,
    product:{
      _id:String(entry.product._id),
      name:entry.product.name,
      price:entry.product.price,
      image:entry.product.image
    }
  }));
  renderPage(req,res,"routes/cardPayment.ejs",{
    cartItems:{items:checkoutItems},
    totalProducts:totals.totalProducts,
    totalProductsPrice:totals.totalProductsPrice,
    deliveryCharge:totals.deliveryCharge,
    orderTotal:totals.orderTotal
  });
}));

router.get("/cart",isLoggedIn,asyncWrap(async(req,res)=>{
  let cartItems = await Cart.findOne({
      user: req.user._id
  }).populate("items.product");
  if(!cartItems || cartItems.items.length==0){
    return renderPage(req,res,"routes/noItemCart.ejs");
  }
  const totals=summarizeCart(cartItems);
  renderPage(req,res,"routes/cart.ejs",
  {
    cartItems,
    totalProducts:totals.totalProducts,
    totalProductsPrice:totals.totalProductsPrice,
    deliveryCharge:totals.deliveryCharge,
    orderTotal:totals.orderTotal
  });
}));

router.get("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;

    const item = await Product.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "owner"
            }
        });

    if (!item) {
        req.flash("error", "Product not found.");
        return res.redirect("/product");
    }

    let canReview = false;

    if (req.user) {
        const deliveredOrder = await Order.findOne({
            customer: req.user._id,
            status: "delivered",
            "products.product": item._id
        });

        // Allow reviewing only if the user has not reviewed this product yet.
        const alreadyReviewed = await Review.exists({
            owner: req.user._id,
            _id: { $in: item.reviews.map(review => review._id) }
        });

        canReview = Boolean(deliveredOrder) && !alreadyReviewed;
    }

    renderPage(req,res,"routes/productDetails.ejs", {
        item,
        canReview
    });
}));



//cart
router.post("/:id/cart",isLoggedIn,asyncWrap(async(req,res)=>{
   let {id}=req.params;
   let quantity=Number(req.body.quantity);
   const product=await Product.findById(id);
   if(!product){req.flash("error","Product not found.");return res.redirect("/product");}
   const stock=Number(product.stock??100);
   if(!Number.isInteger(quantity)||quantity<1){req.flash("error","Choose a valid quantity.");return res.redirect(`/product/${id}`);}
   let cart=await Cart.findOne({user:req.user._id});
   const alreadyInCart=(cart?.items||[]).filter(item=>String(item.product)===String(id)).reduce((sum,item)=>sum+(Number(item.quantity)||0),0);
   if(alreadyInCart+quantity>stock){req.flash("error",stock<1?"This item is out of stock.":`Only ${Math.max(0,stock-alreadyInCart)} more unit(s) are available.`);return res.redirect(`/product/${id}`);}
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

router.delete("/cart/:id", isLoggedIn, asyncWrap(async (req, res) => {
    let { id } = req.params;
    let cart=await Cart.findOne({user:req.user._id});
    await Cart.findByIdAndUpdate(cart._id,{$pull:{items:{product:id}}});
    req.flash("success","Product deleted form cart");
    res.redirect("/product/cart");
}));

module.exports=router;
