import mongoose from "mongoose";
import User from "../models/user.model.js";
import asyncHandler from "../helper/asyncHandler.js";
import apiResponse from "../helper/apiResponse.js";
import ApiError from "../helper/apiError.js";
import axios from "axios";
import Address from "../models/address.model.js";

// Verifying the pin code
export const pinCode = asyncHandler(async (req, res) => {
if(!req.body.pin_code) {
    return res.status(400).json(new apiResponse(400, "Please re-enter the pin code"));
}
  const { pin_code } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified === false) {
    return res.status(400).json(new apiResponse(400, "User is not verified"));
  }

  try {

    
    // First verifying that users address is already present in the database
    const addressExists = await Address.findOne({
      user: req.user._id,
    });

    if (addressExists) {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pin_code}`
      );
      const data = response.data;

      if (data[0].Status === "Error") {
        return res.status(400).json(new apiResponse(400, "Invalid Pin code"));
      }


      const address = await Address.findOneAndUpdate(
        { _id: addressExists._id },

        {
          pin_code: data[0].PostOffice[0].Pincode,
          state: data[0].PostOffice[0].State,
          district: data[0].PostOffice[0].District,
          isPinCodeVerified: true,
        },
        { new: true }
      );

      return res.status(200).json(
        new apiResponse(200, "Pin code fetched successfully", {
          address: address,
        })
      );
    }


    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pin_code}`
    );
    const data = response.data;

    if (data[0].Status === "Error") {
      return res.status(400).json(new apiResponse(400, "Invalid Pin code"));
    }

    const address = await Address.create({
      user: req.user._id,
      pin_code: data[0].PostOffice[0].Pincode,
      state: data[0].PostOffice[0].State,
      district: data[0].PostOffice[0].District,
      isPinCodeVerified: true,
    });

    return res.status(200).json(
      new apiResponse(200, "Pin code fetched successfully", {
        address: address,
      })
    );
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new ApiError(500, "Error fetching data");
  }
});

// Saving the address
export const saveAddress = asyncHandler(async (req, res) => {
    const addressExists = await Address.findOne({
        user: req.user._id,
    });

    if(!addressExists) {
        return res.status(400).json(new apiResponse(400, "Please verify pin code first"));
    }
    
    if (addressExists.isPinCodeVerified === false) {
        return res.status(400).json(new apiResponse(400, "Pin code is not verified"));
    }

  const { fullName, phoneNumber, area, houseNo  } = req.body;
  const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified === false) {
        return res.status(400).json(new apiResponse(400, "User is not verified"));
    }

    


    try {

        const addressExists = await Address.findOne({
            user: req.user._id,
        });

        if((!addressExists.fullName && !fullName)||(!addressExists.phoneNumber && !phoneNumber)||(!addressExists.area && !area)||(!addressExists.houseNo && !houseNo)) {
            return res.status(400).json(new apiResponse(400, "Please fill all the fields"));
        }

       

        if (addressExists) {
            const addressValue = await Address.findOneAndUpdate(
                { _id: addressExists._id },
                {
                    fullName,
                    phoneNumber,
                    houseNo,
                    area,
                },
                { new: true }
            );

            return res.status(200).json(
                new apiResponse(200, "Address updated successfully", {
                    address: addressValue,
                })
            );
        }
    }
    catch (error) {
        console.error("Error saving address:", error.message);
        throw new ApiError(500, "Error saving address");
    }
}
);


export const getAddress = asyncHandler(async (req, res) => {

  const _id = req.query.userId;
  const user = await User.findById(_id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified === false) {
        return res.status(400).json(new apiResponse(400, "User is not verified"));
    }

    try {
        const address = await Address.findOne({
            user: req.user._id,
        });

        if (!address) {
            return res.status(400).json(new apiResponse(400, "Address not found"));
        }

        return res.status(200).json(
            new apiResponse(200, "Address fetched successfully", {
                address: address,
            })
        );
    } catch (error) {
        console.error("Error fetching address:", error.message);
        throw new ApiError(500, "Error fetching address");
    }
}
);


