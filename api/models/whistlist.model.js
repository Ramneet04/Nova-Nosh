import express from 'express';
import mongoose from 'mongoose';
import {Schema} from 'mongoose';



const whistListSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    menu:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu',
        required:true
    }],
   
    
},{ timestamps: true });

const WhistList = mongoose.model('WhistList',whistListSchema);

export default WhistList;