const express=require("express");
const router=express.Router();
const asyncWrap=require("../../utils/asyncWrap.js");
const User=require("../../models/user.js");
const { isLoggedIn } = require("../../user/userMiddleware.js");
const { isAdmin } = require("../adminmiddlerware.js");


router.post("/", async (req, res) => {
    try {
        const adminName = process.env.ADMIN_NAME;
        const password = process.env.ADMIN_PASSWORD;
        const email = process.env.ADMIN_EMAIL;
        if (!password || !email) {
            return res.status(500).send("Admin credentials are not configured");
        }

        const existingAdmin = await User.findOne({
            $or: [
                { username: adminName },
                { email: email }
            ]
        });

        if (existingAdmin) {
            return res.status(409).send("Admin already exists");
        }

        const admin = new User({
            username: adminName,
            role: "admin",
            email: email
        });

        await User.register(admin, password);

        console.log("Admin account created");
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to create admin");
    }
});

router.get("/",isLoggedIn ,isAdmin,(req, res) => {
    res.render("routes/adminProfile.ejs", {
        currUser: req.user
    });
});

module.exports=router;
