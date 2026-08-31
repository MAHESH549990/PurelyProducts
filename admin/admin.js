const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const ejs=require("ejs");
const ejsmate=require("ejs-mate");
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";
const Product=require("./models/products.js");
const Review=require("./models/review.js");
const methodOverride=require("method-override");
const asyncWrap=require("../utils/asyncWrap.js");
const ExpressError=require("../utils/ExpressError.js");
const {productSchema,reviewScheam}=require("../schema.js");


app.set("app engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.engine("ejs",ejsmate);

app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
main().then(()=>{
  console.log("Database connected");
})
.catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect(MONGO_URL);
}

const validateProducts=(req,res,next)=>{
  let {error}=productSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  next();
}

const validateReviews=(req,res,next)=>{
  let {error}=reviewScheam.validate(req.body);
  if(error){
    let errMsg=error.details.map((err)=>err.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  next();
}

app.get("/admin",(req,res)=>{
  res.render("routes/dashboard.ejs");
});

app.get("/admin/products",asyncWrap(async(req,res)=>{
  let products=await Product.find({});
  let totalProducts=await Product.countDocuments();
  res.render("routes/products.ejs",{products,totalProducts});
}));

app.get("/admin/products/new",(req,res)=>{
  res.render("routes/AddNewProduct.ejs");
});

app.post("/admin/products/new",validateProducts,asyncWrap(async(req,res)=>{
  let data=new Product(req.body);
  await data.save();
  console.log(data);
  res.redirect("/admin/products");
}));

app.get("/admin/products/:id",asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id).populate("reviews");
  res.render("routes/item.ejs",{item});
}));

app.get("/admin/products/:id/update",asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id);
  res.render("routes/UpdateProduct.ejs",{item});
}));

app.put("/admin/products/:id",validateProducts,asyncWrap(async(req,res)=>{
   let {id}=req.params;
   await Product.findByIdAndUpdate(id,
    {...req.body},
    {new:true,runValidators: true},
   );
   res.redirect("/admin/products");
}));


app.delete("/admin/products/:id",asyncWrap(async(req,res)=>{
  let {id}=req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/admin/products");
}));

app.listen(port,()=>{
  console.log("Server is running..");
});

//reviews
app.post("/admin/products/:id/reviews",validateReviews,asyncWrap(async(req,res)=>{
     let {id}=req.params;
     const newReview=await new Review(req.body.review);
     const product=await Product.findById(id);

     product.reviews.push(newReview);
     await newReview.save();
     await product.save();
     res.redirect(`/admin/products/${id}`);
}));

app.delete("/admin/products/:id/reviews/:reviewId",async(req,res)=>{
     let {reviewId,id}=req.params;
     await Product.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/admin/products/${id}`);
});

app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status).render("routes/error.ejs",{message});
});
