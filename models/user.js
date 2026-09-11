const mongoose=require("mongoose");
const {Schema}=mongoose;
const UserAddress=require("./userAddress.js");
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema({
   email:{
    type:String,
    required:true
   },
   role: {
        type: String,
        enum: ["customer", "admin", "delivery"],
        default: "customer"
    },
    address:{
        type:Schema.Types.ObjectId,
        ref:"UserAddress"
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);