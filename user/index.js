const express = require("express");
const router=express.Router();
const mongoose = require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";
let reviews=require("./routes/reviews.js");
let users=require("./routes/users.js");

main().then(() => {
  console.log("Database connected");
})
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

router.get("/", (req, res) => {
  res.send("You're in the home page");
});

//users
router.use("/users",users);
//cart

// router.post("/users/:id", async (req, res) => {
//   const { id } = req.params;
//   let item = await Product.findById(id);
//   console.log(item);
//   const cartData=new Cart({
//     name:item.name,
//     price:item.price,
//     image:item.image,
//     description:item.description,
//     rating:item.rating,
//   });
//   await cartData.save();
//   res.redirect("/home");
// });


//reviews
router.use("/users/:id/reviews",reviews);

module.exports=router;
