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
         country:{
            type:String,
            default:"India"
         },
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
     ],
     loggedAt:{
      type:Date,
      default:Date.now
    },
    searchHistory:[{
      query:{type:String,trim:true,maxlength:80},
      searchedAt:{type:Date,default:Date.now}
    }],
    cartHistory:[{
      product:{type:Schema.Types.ObjectId,ref:"Product"},
      addedAt:{type:Date,default:Date.now}
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);
