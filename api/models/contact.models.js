import mongoose from "mongoose";
import {Schema} from "mongoose";

const ContactSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:Number,
        require:true
    },
    message:{
        type:String,
        require:true
    }
},
{
    timestamps : true
}

) 


const Contact = mongoose.model("Contact",ContactSchema);
export default Contact