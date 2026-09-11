const mongoose=require("mongoose");
const {Schema}=mongoose;

const userAddressSchema=new Schema({
  state:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  location:{
    type:String,
    minlength:15,
    required:true
  }
});

module.exports=mongoose.model("UserAddress",userAddressSchema);