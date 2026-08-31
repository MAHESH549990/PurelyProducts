const mongoose=require("mongoose");
const {Schema}=mongoose;

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
  }
});

module.exports=mongoose.model("Review",reviewSchema);