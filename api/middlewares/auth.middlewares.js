import jwt from 'jsonwebtoken';
import  User  from '../models/user.model.js';
import asyncHandler from '../helper/asyncHandler.js';
import ApiError from '../helper/apiError.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        
        const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ", "");
       
        if (!token) {
            return next(new ApiError(401, "Unauthorized: Token is missing"));
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        
        if (!user) {
            return next(new ApiError(401, "Unauthorized: User not found"));
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return next(new ApiError(401, "Unauthorized: Token is invalid"));
    }
});
