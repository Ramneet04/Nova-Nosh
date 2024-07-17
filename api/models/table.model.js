import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const TableSchema = new Schema(
    {
      
        email:{
            type : String,
            required : true
        },
        phone:{
            type : Number,
            required : true
        },
        message:{
            type : String,
           
        },
        capacity:{
            type : Number,
            required : true
        },
        isReserved:{
            type : Boolean,
            default : false
        },
        reservedAt:{
            type : Date
        },
        reservedTime:{
            type : String,
        },
        userId:{
            type : Schema.Types.ObjectId,
            ref : 'User'
        },
        reservedBy:{
            type : String,
            required : true
        },
        isOccupied:{
            type : Boolean,
            default : false
        },
        event:{
            type:String,
            default : null
        },
        message:{
            type : String,
            default : null
        }
        
    },
    { timestamps: true })


    const Table = mongoose.model('Table', TableSchema);

    export default Table;