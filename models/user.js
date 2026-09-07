const mongoose=require("mongoose");
const {Schema}=mongoose;
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
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);