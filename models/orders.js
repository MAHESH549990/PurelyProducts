const mongoose=require("mongoose");
const {Schema}=mongoose;
const User=require("./user.js");
const Product=require("./products.js");

const ordersSchema=new Schema({
    customer:{
       type:Schema.Types.ObjectId,
       ref:"User"
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
    status: {
        type: String,
        enum: [
            "placed",
            "confirmed",
            "packed",
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