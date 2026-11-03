const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const flash=require("connect-flash");
const sessioin=require("express-session");
const passport=require("passport");
const mongoose=require("mongoose");
// The local Windows DNS resolver on this machine refuses SRV queries used by
// Atlas mongodb+srv URIs. Use a public resolver locally; hosted Linux keeps
// its platform-provided resolver.
if (process.platform === "win32") {
  require("node:dns").setServers(["8.8.8.8", "8.8.4.4"]);
}
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const Product=require("./models/products.js");
const ExpressError=require("./utils/ExpressError.js");
const renderPage=require("./utils/renderPage.js");
require("dotenv").config();

const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const sessionOptioins={
    secret:process.env.SECRET || "mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+14*24*60*60*1000,
        maxAge:14*24*60*60*1000,
        httpOnly:true,
        sameSite:"lax",
        secure:"auto"
    }
}

app.use(sessioin(sessionOptioins));
app.use(flash());

// ⭐ ROOT PUBLIC FOLDER
app.use(express.static(path.join(__dirname, "public")));
app.use("/app", express.static(path.join(__dirname, "public", "app")));

// Static files
// app.use(express.static(path.join(__dirname, "user/public")));
// app.use(express.static(path.join(__dirname, "admin/public")));

//use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// Routes
const userRoutes = require("./user/index");
const adminRoutes = require("./admin/admin");
const adminOrderRoutes = require("./admin/routes/orders.js");
const deliveryOrderRoutes = require("./delivery/routes/ordersAssign.js");
const deliveryRoutes=require("./delivery/delivery.js");
const products=require("./user/routes/porduct.js");

// Small read-only API used by the React storefront.
app.get("/api/products", async (req, res, next) => {
  try {
    const products = await Product.find({}).select("name price image rating description category").lean();
    res.json({ products });
  } catch (error) {
    next(error);
  }
});
app.get("/api/notices", (req, res) => {
  res.json({ success: req.flash("success"), error: req.flash("error") });
});

const reactEntry = path.join(__dirname, "public", "app", "index.html");
const serveReact = (req, res, next) => {
  if ((req.get("accept") || "").toLowerCase().includes("application/json")) return next();
  res.sendFile(reactEntry, error => { if (error) next(); });
};
app.get("/product", serveReact);
app.get("/users/login", serveReact);
app.get("/users/signup", serveReact);
app.get("/", serveReact);

// Register admin order URLs at the app level so they cannot be swallowed by
// the broader /admin/users or /users route mounts.
app.use("/admin/users/orders",adminOrderRoutes);
app.use("/delivery/orders",deliveryOrderRoutes);
app.use("/", userRoutes);
app.use("/product",products);
app.use("/delivery",deliveryRoutes);
app.use("/admin", adminRoutes);

//middleware
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status);
  renderPage(req,res,"routes/error.ejs",{message,status});
});

// Render and local deployments can supply PORT; keep 8080 as the local default.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

mongoose.connect(process.env.ATLAS_URL)
  .then(() => console.log("Database connected"))
  .catch(error => {
    console.error("MongoDB connection failed. Check ATLAS_URL, DNS/network access, and Atlas database-user credentials.");
    console.error(`${error.name}: ${error.message}`);
  });
