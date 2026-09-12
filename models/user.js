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
    },
    address:[
        {
         state:{
            type:String
         },
         city:{
            type:String
         },
         location:{
            type:String,
         }
        }    
     ]
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);