const mongoose=require("mongoose");
const data=require("./data.js");
const Product=require("../models/products.js");

const MONGO_URL="mongodb://127.0.0.1:27017/PurelyProducts";

main().then(()=>{
  console.log("Database connected");
})
.catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect(MONGO_URL);
}

const initDB=async ()=>{
  await Product.deleteMany({});
  await Product.insertMany(data.data);
  console.log("Data was initialized");
}

initDB();