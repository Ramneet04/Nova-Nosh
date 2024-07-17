import express from 'express';
import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const menuSchema = new Schema({
    menuName :{
        type :String,
        required : true
    },
    menuDescription :{
        type :String,
        required : true
    },
    menuPrice :{
        type :Number,
        required : true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    menuImage :{
        type :String, 
        required : true
    },
    menuCategory :{
        type :String,
       
        required : true
    },
    menuType :{
        type :String,
        required : true
    },
   
    menuRating :{
        type :Number,
    },
    menuDiscount :{
        type :Number,
    },
    discountPrice :{
        type :Number,
    },
    menuStatus :{
        type :String,
        default : "In Stock "
    },
    menuIngredients :{
        type :String,
    },
    isWhistListed:{
        type:Boolean,
        default:false
    }
    
},{ timestamps: true });

const Menu = mongoose.model('Menu',menuSchema);
export default Menu;