const mongoose = require("mongoose");
const { Schema } = mongoose;
const User=require("./user.js");

const deliverySchema = new Schema(
  {
    // Link to the existing User account
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Contact details
    phone: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: String,
      enum: [
        "Fresher",
        "Less than 1 year",
        "1-3 years",
        "3+ years"
      ],
      required: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    // Vehicle details
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    // Driving licence document
    licenseImage: {
      url: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true
      }
    },

    // Admin approval workflow
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    reviewedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);