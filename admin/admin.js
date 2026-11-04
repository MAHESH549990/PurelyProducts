const express=require("express");
const renderPage=require("../utils/renderPage.js");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js");
const products=require("./routes/product.js");
const users=require("./routes/users.js");
const delivery=require("./routes/deliveryPartner.js");
const profile=require("./routes/profile.js");
const inventory=require("./routes/inventory.js");
const adminOrders=require("./routes/orders.js");
const Order=require("../models/orders.js");
const Product=require("../models/products.js");
const asyncWrap=require("../utils/asyncWrap.js");
const {buildEarningsMetrics}=require("../utils/earningsMetrics.js");
const { isAdmin } = require("./adminmiddlerware.js");


router.get("/",isAdmin,asyncWrap(async(req,res)=>{
  const orders=await Order.find({$or:[{assignedAt:{$exists:true}},{status:{$in:["assigned","out_for_delivery","delivered"]}}]}).select("status adminProfit assignedAt createdAt").lean();
  const [inventoryCount,lowStockCount]=await Promise.all([Product.countDocuments(),Product.countDocuments({stock:{$gt:0,$lte:5}})]);
  renderPage(req,res,"routes/dashboard.ejs",{earnings:buildEarningsMetrics(orders,"admin"),inventoryCount,lowStockCount});
}));

//products
router.use("/products",products);
router.use("/inventory",inventory);
// Keep admin order pages available through the admin router as a fallback as
// well as the app-level mount used for the current React route structure.
router.use("/users/orders",adminOrders);

//users
router.use("/users",users);

//delivery partner
router.use("/delivery",delivery);

//admin profile
router.use("/profile",profile);

router.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

router.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status);
  renderPage(req,res,"routes/error.ejs",{message,status});
});

module.exports=router;
