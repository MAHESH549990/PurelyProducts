const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const ejsMate = require("ejs-mate");
const Product = require("../admin/models/products.js");
const mongoose = require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";
const methodOverride = require("method-override");
const ExpressError=require("../utils/ExpressError.js");
const asyncWrap=require("../utils/asyncWrap.js");

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


main().then(() => {
  console.log("Database connected");
})
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(port, () => {
  console.log("Server is running...");
});

app.get("/", (req, res) => {
  res.send("You're in the home page");
});

//login,register route
app.get("/login", (req, res) => {
  res.render("users/login.ejs");
})
app.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
app.get("/updatePassword", (req, res) => {
  res.render("users/forgetPass.ejs");
});

//home route
app.get("/user", async (req, res) => {
  const allProducts = await Product.find({});
  res.render("routes/home.ejs", { allProducts });
});

app.get("/user/:id", async (req, res) => {
    const item = await Product.findById(req.params.id);
    res.render("routes/items.ejs", { item });
});

//cart

app.post("/user/:id", async (req, res) => {
  const { id } = req.params;
  let item = await Product.findById(id);
  console.log(item);
  const cartData=new Cart({
    name:item.name,
    price:item.price,
    image:item.image,
    description:item.description,
    rating:item.rating,
  });
  await cartData.save();
  res.redirect("/home");
});

app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status).render("routes/error.ejs",{message});
});
