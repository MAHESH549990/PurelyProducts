const mongoose=require("mongoose");
const {Schema}=mongoose;
const User=require("./user.js");

const reviewSchema=new Schema({
  comment:{
    type:String,
    required:true
  },
  rating:{
    type:Number,
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  image:{
    url:{
      type:String
    }
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

module.exports=mongoose.model("Review",reviewSchema);