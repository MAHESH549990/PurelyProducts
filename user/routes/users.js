const express = require("express");
const router=express.Router({mergeParams:true});
const User = require("../../models/user.js");
const passport=require("passport");
const asyncWrap=require("../../utils/asyncWrap.js");
const Delivery = require("../../models/delivery.js");
const {isLoggedIn}=require("../userMiddleware.js");
//for storing the file data 
const multer = require("multer");
const cloudinary = require("../../cloudConfig.js");
const { Readable } = require("stream");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

//login,register route

router.get("/signup", (req, res) => {
  res.render("userLogin/signup.ejs");
});

router.post("/signup",asyncWrap(async(req,res)=>{
  try{
   let {username,email,password}=req.body;
   let newUser=new User({
    username:username,
    email:email
   });
   let registerdUser=await User.register(newUser,password);
   req.login(registerdUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Welcome to PurelyProducts");
   res.redirect("/users/dashboard");
   });
  }
  catch(err){
    req.flash("error",err.message);
    res.redirect("/users/signup");
  }
}));


router.get("/login", (req, res) => {
  res.render("userLogin/login.ejs");
});

router.post("/login",
  passport.authenticate("local",{
    failureRedirect:"/users/login",
    failureFlash:true
  }),
  asyncWrap(async(req,res)=>{
     if(req.user.role=="admin"){
     req.flash("success","Welcome Admin back! to PurelyProducts");
     res.redirect("/admin");
     }
     else{
      req.flash("success","Welcome back! to PurelyProducts");
     res.redirect("/users/dashboard");
     }
}));

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
     if(err){
          return next(err);
     }
     req.flash("success","You're logged out");
     res.redirect("/users/dashboard");
  });
});

//profile
router.get("/profile/location",(req,res)=>{
  res.render("routes/userAddress.ejs");
});

router.post("/profile",isLoggedIn,asyncWrap(async(req,res)=>{
    let {state,city,location}=req.body;
    let id=req.user._id;
    let Useraddress=await User.findById(id);
    Useraddress.address.push({
      state:state,
      city:city,
      location:location
    });
    Useraddress.save();
    req.flash("success","Address added successfully");
    res.redirect("/users/profile");
}));

//Update route
router.get("/profile/:id/update",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let us=await User.findById(req.user._id);
  let userAddressArrays=us.address;
  let user=userAddressArrays.id(id);
  res.render("routes/updateAddress.ejs",{user,id});
}));

router.put("/profile/:id/update",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let {state,city,location}=req.body;
  let us=await User.findById(req.user._id);
  let userAddressArrays=us.address;
  let address=userAddressArrays.id(id);
  address.state=state;
  address.city=city;
  address.location=location;
  us.save();
  req.flash("success","Address updated successfully")
  res.redirect("/users/profile");
}));

router.delete("/profile/:id",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let us=await User.findById(req.user._id);
  let address=us.address;
  let newAddress=address.filter((item)=>{
    return item._id!=id;
  });
  us.address=newAddress;
  us.save();
  req.flash("success","Address Deleted");
  res.redirect("/users/profile");
}));

router.get("/profile",isLoggedIn,asyncWrap(async(req,res)=>{
  let user=req.user;
  let id=req.user._id;
  let address=await User.findById(id);
  let Useraddress=address.address;
  res.render("routes/profile.ejs",{user,Useraddress});
}));



router.get("/updatePassword", (req, res) => {
  res.render("userLogin/forgetPass.ejs");
});

router.get("/dashboard", (req, res) => {
    res.render("routes/userDashboard.ejs");
});

router.get("/profile/request/delivery",(req,res)=>{
  res.render("routes/deliveryRequest.ejs");
});

router.post(
    "/profile/request/delivery",
    isLoggedIn,
    upload.single("licenseImage"),
    asyncWrap(async (req, res) => {
        let uploadedFile;

        try {
            // 1. Check whether this user has already applied
            const existingApplication = await Delivery.findOne({
                user: req.user._id
            });

            if (existingApplication) {
                req.flash(
                    "error",
                    "Your delivery partner application has already been submitted."
                );
                return res.redirect("/users/profile");
            }

            // 2. Check uploaded file
            if (!req.file) {
                req.flash("error", "Please upload your driving licence.");
                return res.redirect("/users/profile/request/delivery");
            }

            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(req.file.mimetype)) {
                req.flash(
                    "error",
                    "Invalid file type. Upload a PDF, JPG, PNG, or WEBP file."
                );
                return res.redirect("/users/profile/request/delivery");
            }

            const {
                phone,
                experience,
                address,
                vehicleNumber,
                licenseNumber
            } = req.body;

            // 3. Upload the licence to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "purelyproducts/delivery-licenses",
                        resource_type: "raw",
                        type: "authenticated"
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                Readable.from(req.file.buffer).pipe(stream);
            });

            uploadedFile = result;

            // 4. Save the application in MongoDB
            await Delivery.create({
                user: req.user._id,
                phone,
                experience,
                address,
                vehicleNumber,
                licenseNumber,
                licenseImage: {
                    url: result.secure_url,
                    filename: req.file.originalname,
                    publicId: result.public_id
                },
                applicationStatus: "pending"
            });

            req.flash(
                "success",
                "Your delivery partner application has been submitted successfully!"
            );

            return res.redirect("/users/profile");

        } catch (err) {
            console.error("Delivery application error:", err);

            // 5. Clean up Cloudinary file if saving failed
            if (uploadedFile?.public_id) {
                try {
                    await cloudinary.uploader.destroy(
                        uploadedFile.public_id,
                        {
                            resource_type: "raw",
                            type: "authenticated"
                        }
                    );
                } catch (cleanupError) {
                    console.error(
                        "Cloudinary cleanup failed:",
                        cleanupError
                    );
                }
            }

            // Handle duplicate-key errors if a unique index exists
            if (err.code === 11000) {
                req.flash(
                    "error",
                    "Your delivery partner application has already been submitted."
                );
                return res.redirect("/users/profile");
            }

            req.flash(
                "error",
                "Unable to submit your application. Please try again."
            );

            return res.redirect("/users/profile/request/delivery");
        }
    })
);
module.exports=router;

