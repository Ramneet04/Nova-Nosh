import e from "express";
import mongoose from "mongoose";
import { Schema } from "mongoose";


const orderSchema = new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    orderStatus:{
        type:String,
        default:"Pending"
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    menus:{
        type: Object,
        required: true
    },
    totalQuantity:{
        type:Number,
        required:true
    },
    customerName:{
        type:String,
        required:true
    },
    customerAddress:{
        type:String,
        required:true
    },
    customerEmail:{
        type:String,
        required:true
    },
    totalMoney:{
        type:Number,
        required:true
    }   
},
{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;