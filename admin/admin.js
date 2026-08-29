const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const ejs=require("ejs");
const ejsmate=require("ejs-mate");
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";
const Product=require("./models/products.js");
const methodOverride=require("method-override");
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

app.get("/admin",(req,res)=>{
  res.render("routes/dashboard.ejs");
});

app.get("/admin/products",async(req,res)=>{
  let products=await Product.find({});
  res.render("routes/products.ejs",{products});
});

app.get("/admin/products/new",(req,res)=>{
  res.render("routes/AddNewProduct.ejs");
});

app.post("/admin/products/new",async(req,res)=>{
  let data=new Product(req.body);
  await data.save();
  console.log(data);
  res.redirect("/admin/products");
});

app.get("/admin/products/:id",async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id);
  res.render("routes/item.ejs",{item});
});

app.get("/admin/products/:id/update",async(req,res)=>{
  let {id}=req.params;
  let item=await Product.findById(id);
  res.render("routes/UpdateProduct.ejs",{item});
});

app.put("/admin/products/:id",async(req,res)=>{
   let {id}=req.params;
   await Product.findByIdAndUpdate(id,
    {...req.body},
    {new:true,runValidators: true},
   );
   res.redirect("/admin/products");
});


app.delete("/admin/products/:id",async(req,res)=>{
  let {id}=req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/admin/products");
});

app.listen(port,()=>{
  console.log("Server is running..");
});
