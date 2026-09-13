const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash=require("connect-flash");
const sessioin=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const ExpressError=require("./utils/ExpressError.js");


const app = express();

// EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.set("views", [
    path.join(__dirname, "user/views"),
    path.join(__dirname, "admin/views"),
    path.join(__dirname,"delivery/views")
]);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const sessionOptioins={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+14*24*60*60*1000,
        maxAge:14*24*60*60*1000,
        httpOnly:true
    }
}

app.use(sessioin(sessionOptioins));
app.use(flash());

// ⭐ ROOT PUBLIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

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
const deliveryRoutes=require("./delivery/delivery.js");
const products=require("./user/routes/porduct.js");

app.use("/", userRoutes);
app.use("/product",products);
app.use("/delivery",deliveryRoutes);
app.use("/admin", adminRoutes);

// Server
app.listen(8080, () => {
    console.log("Server started on port 8080");
});

//middleware
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status).render("routes/error.ejs",{message});
});