import jwt from 'jsonwebtoken';
import  User  from '../models/user.model.js';
import asyncHandler from '../helper/asyncHandler.js';
import ApiError from '../helper/apiError.js';

export const refreshToken = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return next(new ApiError(401, "Unauthorized: Token is missing"));
    }
    
    try {
       

        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return next(new ApiError(401, "Unauthorized: Refresh Token is missing"));
        }
    
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        

        const user = await User.findById(decodedRefreshToken?.id);

      

        if (!user) {
            return next(new ApiError(401, "Unauthorized: User not found"));
        }

        // Generate new tokens
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save();
            
        const options = {
            httpOnly: true,
            secure: true,
        };

        // Set new tokens as cookies
        res.cookie("refreshToken", newRefreshToken, options);
        res.cookie("accessToken", newAccessToken, options);

        
            
       

        next();
    } catch (error) {
        return next(new ApiError(401, "Error Refreshing Tokens", error.message));
    }
});

