const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const ExpressError=require("../utils/ExpressError.js");
const products=require("./routes/product.js");
const users=require("./routes/users.js");
const orders=require("./routes/orders.js");
const delivery=require("./routes/deliveryPartner.js");
const profile=require("./routes/profile.js");
const { isAdmin } = require("./adminmiddlerware.js");


const ATLAS_URL=process.env.ATLAS_URL;

main().then(()=>{
  console.log("Database connected");
})
.catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect(ATLAS_URL);
}


router.get("/",isAdmin,(req,res)=>{
  res.render("routes/dashboard.ejs");
});

//products
router.use("/products",products);

//users
router.use("/users",users);

//delivery partner
router.use("/delivery",delivery);

//users order status 
router.use("/users/orders",orders);

//admin profile
router.use("/profile",profile);

router.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

router.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status).render("routes/error.ejs",{message});
});

module.exports=router;