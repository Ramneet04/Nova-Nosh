import mongoose from 'mongoose';

import { Schema } from 'mongoose';

const orderStatusSchema = new Schema({
   statusDetails:[{
        status:{
            type: String,
            default: "Pending",
           

        },
        updated_at:{
            type: Date,
            required: true
        }
    }],
   
    orderId :{
            type : Schema.Types.ObjectId,
            ref : 'Order',
            required : true
    }



},{timestamps: true});


const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);
export default OrderStatus;