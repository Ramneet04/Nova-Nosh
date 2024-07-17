import asyncHandler from "../helper/asyncHandler.js";
import apiResponse from "../helper/apiResponse.js";
import ApiError from "../helper/apiError.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Cart from "../models/cart.model.js";
import Order from "../models/orders.models.js";
import User from "../models/user.model.js";
import Address from "../models/address.model.js";
import mongoose from "mongoose";
export const order = asyncHandler(async (req, res, next) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = req.body;
    const order = await razorpay.orders.create(options);
    if (!order) {
      return next(new ApiError(400, "Order creation failed"));
    }

    return res
      .status(200)
      .json(new apiResponse(order, "Order created successfully", 200));
  } catch (error) {
    throw new ApiError(500, "Error creating order : " + error.message);
  }
});

export const capture = asyncHandler(async (req, res, next) => {
  try {
    const { razorpay_payment_id, order_id, razorpay_signature, _id, userId,totalMoney } =req.body;
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      throw new ApiError(400, "Transaction not captured");
    }

    const cartData = await Cart.findOne({ user: userId, _id });
    if (!cartData) {
      throw new ApiError(404, "Cart not found");
    }
    const orderExist = await Order.findOne({ orderId: order_id, user: userId });
    if (orderExist) {
      throw new ApiError(400, "Order already exist");
    }

    const Username = await User.findById(userId);
    ;


    const Addr = await Address.findOne({ user: userId });
   
    

    const orderData = await Order.create({
      user: userId,
      paymentId: razorpay_payment_id,
      orderId: order_id,
      menus: cartData.menus,
      totalQuantity: cartData.totalQuantity,
      isPaid: true,
      customerName: Username.firstName + " " + Username.lastName,
      customerAddress:
        Addr.houseNo +
        " " +
        Addr.area +
        "," +
        Addr.district +
        "," +
        Addr.state +
        "-" +
        Addr.pin_code,
      customerPhoneNumber: Addr.phoneNumber,
      customerEmail: Username.email,
      totalMoney: totalMoney,
    });

    
    await Cart.findByIdAndDelete(_id);

    return res
      .status(200)
      .json(new apiResponse(orderData, "Payment successfully", 200));
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "Error capturing payment : " + error.message);
  }
});
