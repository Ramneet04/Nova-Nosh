import asyncHandler from "../helper/asyncHandler.js";
import ApiError from "../helper/apiError.js";
import apiResponse from "../helper/apiResponse.js";
import User from "../models/user.model.js";
import Contact from "../models/contact.models.js";
import { contactEmail } from "../helper/contactMail.js";

export const sendContactEmail = asyncHandler(async(req,res)=>{
    try {
        const {name,email,phoneNumber,message} = req.body;
        console.log(req.body)
        if(!name || !email || !phoneNumber || !message){
            throw new ApiError(400,"Please fill all fields")
        }
        
        const contact = await Contact.create({
            name,
            email,
            phoneNumber,
            message
        })

        const result = await contactEmail({name,email,phoneNumber,message})

        if(!result.success){
            throw new ApiError(500,"Internal Server Error")
        }
        else{
        return res
        .status(200)
        .json(new apiResponse({contact},"Thank you for reaching out! Your message has been received and we'll get back to you shortly",200) )
        }
        
    } catch (error) {
        console.log(error)
        throw new ApiError (500,"Internal Server Error")
    }
})