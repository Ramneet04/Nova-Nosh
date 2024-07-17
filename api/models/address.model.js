import mongoose from "mongoose";
import { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: Number,
      default: "",

     
    },
    houseNo: {
      type: String,
      default: "",
    },
    area: {
        type: String,
          default: "",
        },

    pin_code: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    isPinCodeVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


 const Address = mongoose.model("Address", addressSchema);

    export default Address;