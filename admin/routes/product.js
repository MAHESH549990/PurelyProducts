const express=require("express");
const router=express.Router();
const Product=require("../../models/products.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");

const validateProducts=(req,res,next)=>{
  let {error}=productSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  next();
}



router.get("/",asyncWrap(async(req,res)=>{
  let products=await Product.find({});
  let totalProducts=await Product.countDocuments();
  res.render("routes/products.ejs",{products,totalProducts});
}));

router.get("/new",(req,res)=>{
  res.render("routes/AddNewProduct.ejs");
});

router.post("/new",validateProducts,asyncWrap(async(req,res)=>{
  let data=new Product(req.body);
  await data.save();
  console.log(data);
  res.redirect("/admin/products");
}));

router.get("/:id",asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id).populate("reviews");
  res.render("routes/item.ejs",{item});
}));

router.get("/:id/update",asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id);
  res.render("routes/UpdateProduct.ejs",{item});
}));

router.put("/:id",validateProducts,asyncWrap(async(req,res)=>{
   let {id}=req.params;
   await Product.findByIdAndUpdate(id,
    {...req.body},
    {new:true,runValidators: true},
   );
   res.redirect(`/admin/products/${id}`);
}));


router.delete("/:id",asyncWrap(async(req,res)=>{
  let {id}=req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/admin/products");
}));

module.exports=router;