const mongoose=require("mongoose");
const {Schema}=mongoose;
const User=require("./user.js");
const Product=require("./products.js");

const cartSchema=new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  items:[
    {
      product:{
        type:Schema.Types.ObjectId,
        ref:"Product"
      },
      quantity:{
        type:Number,
        default:1,
        min:1,
        max:7
      }
    }
  ]
});

module.exports=mongoose.model("Cart",cartSchema);