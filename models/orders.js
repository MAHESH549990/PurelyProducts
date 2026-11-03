const mongoose=require("mongoose");
const {Schema}=mongoose;
const User=require("./user.js");
const Product=require("./products.js");

const ordersSchema=new Schema({
    customer:{
       type:Schema.Types.ObjectId,
       ref:"User"
    },
    createdAt:{
      type:Date,
      default:Date.now
    },
    products:[
      {
        product:{
          type:Schema.Types.ObjectId,
          ref:"Product"
        },
        quantity:Number
      }
    ],

    totalAmount:{
      type:Number
    },
    deliveryCharge:{
        type:Number,
        min:0,
        default:0
    },
    deliveryAddress:{
        location:{type:String,trim:true},
        city:{type:String,trim:true},
        state:{type:String,trim:true}
    },
    adminProfit:{type:Number,min:0},
    assignedAt:{type:Date},
    deliveryEarnings:{type:Number,min:0},
    deliveredAt:{type:Date},
    paymentProvider:{type:String,enum:["razorpay","demo"]},
    paymentId:{type:String,sparse:true,unique:true},
    paymentOrderId:{type:String},
    paymentStatus:{type:String,enum:["pending","paid","failed"]},
    status: {
        type: String,
        enum: [
            "placed",
            "confirmed",
            "assigned",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ],
        default: "placed"
    },

    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports=mongoose.model("Order",ordersSchema);
