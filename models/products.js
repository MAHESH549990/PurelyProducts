const mongoose=require("mongoose");
const {Schema}=mongoose;
const Review=require("./review.js");

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
  stock:{
    type:Number,
    required:true,
    min:0,
    default:100,
    validate:{validator:Number.isInteger,message:"Stock must be a whole number."}
  },
  image:{
    // filename:{
    //   type:String,
    // },
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
  category:{
    type:String,
    trim:true,
    default:"Other"
  },
  reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
  ],
});

productsSchema.post("findOneAndDelete",async(product)=>{
  if(product){
   await Review.deleteMany({_id:{$in:product.reviews}});
  }
})

const Product=mongoose.model("Product",productsSchema);

module.exports=Product;
