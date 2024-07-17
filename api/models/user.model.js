import express from "express";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    phone: {
      type: Number,
    },
    image: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // forgot password token and expire
    forgotPasswordToken: String,
    forgotPasswordExpire: Date,

    // verify email token and expire
    verifyToken: String,
    verifyTokenExpire: Date,
  },
  { timestamps: true }
);

// user creates or changes their password, we want to make sure that it's kept safe and secure
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  } else {
    next();
  }
});

//to match the password
userSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

//generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE,
  });
};

//generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
