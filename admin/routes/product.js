const express=require("express");
const renderPage=require("../../utils/renderPage.js");
const router=express.Router();
const Product=require("../../models/products.js");
const asyncWrap=require("../../utils/asyncWrap.js");
const ExpressError=require("../../utils/ExpressError.js");
const {productSchema}=require("../../schema.js");
const { isAdmin } = require("../adminmiddlerware.js");
const multer=require("multer");
const cloudinary=require("../../cloudConfig.js");
const {Readable}=require("node:stream");

const productUpload=multer({
  storage:multer.memoryStorage(),
  limits:{fileSize:8*1024*1024},
  fileFilter:(req,file,done)=>file.mimetype.startsWith("image/")
    ?done(null,true)
    :done(new ExpressError(400,"Choose an image file for the product."))
});

const storeProductImage=asyncWrap(async(req,res,next)=>{
  if(!req.file){
    if(req.params.id){
      const existing=await Product.findById(req.params.id).select("image");
      if(!existing)throw new ExpressError(404,"Product not found.");
      req.body.image=existing.image;
      return next();
    }
    throw new ExpressError(400,"Please choose a product image.");
  }

  const uploaded=await new Promise((resolve,reject)=>{
    const stream=cloudinary.uploader.upload_stream(
      {folder:"PurelyProducts/products",resource_type:"image"},
      (error,result)=>error?reject(error):resolve(result)
    );
    Readable.from(req.file.buffer).pipe(stream);
  });
  req.body.image={url:uploaded.secure_url};
  next();
});

const validateProducts=(req,res,next)=>{
  let {error}=productSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  next();
}



router.get("/",isAdmin,asyncWrap(async(req,res)=>{
  let products=await Product.find({});
  let totalProducts=await Product.countDocuments();
  renderPage(req,res,"routes/products.ejs",{products,totalProducts});
}));

router.get("/new",isAdmin,(req,res)=>{
  renderPage(req,res,"routes/AddNewProduct.ejs");
});

router.post("/new",isAdmin,productUpload.single("image"),storeProductImage,validateProducts,asyncWrap(async(req,res)=>{
  let data=new Product(req.body);
  await data.save();
  req.flash("success","Product created successfully");
  res.redirect("/admin/products");
}));

router.get("/:id",isAdmin,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id).populate({
    path:"reviews",
    populate:{
      path:"owner"
    }
  });
  renderPage(req,res,"routes/item.ejs",{item});
}));

router.get("/:id/update",isAdmin,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id);
  renderPage(req,res,"routes/UpdateProduct.ejs",{item});
}));

router.put("/:id",isAdmin,productUpload.single("image"),storeProductImage,validateProducts,asyncWrap(async(req,res)=>{
   let {id}=req.params;
   await Product.findByIdAndUpdate(id,
    {...req.body},
    {new:true,runValidators: true},
   );
   req.flash("success","Product updated successfully");
   res.redirect(`/admin/products/${id}`);
}));


router.delete("/:id",isAdmin,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  await Product.findByIdAndDelete(id);
  req.flash("success","Product deleted successfully");
  res.redirect("/admin/products");
}));

module.exports=router;
