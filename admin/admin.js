const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";
const ExpressError=require("../utils/ExpressError.js");
const products=require("./routes/product.js");
const reviews=require("./routes/reviews.js");

main().then(()=>{
  console.log("Database connected");
})
.catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect(MONGO_URL);
}


router.get("/",(req,res)=>{
  res.render("routes/dashboard.ejs");
});

//products
router.use("/products",products);

//reviews
router.use("/products/:id/reviews",reviews);

router.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

router.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status).render("routes/error.ejs",{message});
});

module.exports=router;