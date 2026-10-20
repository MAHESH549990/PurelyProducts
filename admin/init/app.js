const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose=require("mongoose");
const data=require("./data.js");
const Product=require("../../models/products.js");
require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const ATLAS_URL=process.env.ATLAS_URL;

main().then(()=>{
  console.log("Database connected");
})
.catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect(ATLAS_URL);
}

const initDB=async ()=>{
  await Product.deleteMany({});
  await Product.insertMany(data.data);
  console.log("Data was initialized");
}

initDB();