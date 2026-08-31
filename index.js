const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const app = express();

// EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.set("views", [
    path.join(__dirname, "user/views"),
    path.join(__dirname, "admin/views")
]);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ⭐ ROOT PUBLIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// Static files
app.use(express.static(path.join(__dirname, "user/public")));
app.use(express.static(path.join(__dirname, "admin/public")));

// Routes
const userRoutes = require("./user/index");
const adminRoutes = require("./admin/admin");

app.use("/admin", adminRoutes);
app.use("/", userRoutes);
// Server
app.listen(8080, () => {
    console.log("Server started on port 8080");
});