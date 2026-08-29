const mongoose=require("mongoose");
const {Schema}=mongoose;

const productsSchema=Schema({
  name:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
    min:1,
  },
  image:{
    filename:{
      type:String,
    },
    url:{
      type:String,
      required:true,
    },
  },
  rating:{
    type:Number,
    required:true,
    min:1,
    max:5,
  },
  description:{
    type:String,
    required:true,
  },
});

const Product=mongoose.model("Product",productsSchema);

module.exports=Product;