import User from "../models/user.model.js";
import ApiError from "../helper/apiError.js";
import { sendEmail } from "../helper/sendMail.js";
import asyncHandler from "../helper/asyncHandler.js";
import apiResponse from "../helper/apiResponse.js";
import schedule from "node-schedule";


//functions to be used later---------------------------------------------------------------------------------------------
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  const lowercase = /[a-z]/.test(password);
  const uppercase = /[A-Z]/.test(password);
  const number = /[0-9]/.test(password);
  const special = /[@,#,$,%,&,*]/.test(password);
  const length = password.length >= 8;
  return lowercase && uppercase && number && special && length;
}

function generateRandomPassword(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charset.length);
    password = password + charset.charAt(index);
  }

  return password;
}

const generate_Access_Refresh_Token = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error In generating token");
  }
};
//----------------------------------------------------------------------------------------------------------------------------

//signUp function----------------------------------------------------------------------------------------------------------------
export const signUp = asyncHandler(async (req, res) => {
  const { lastName, firstName, email, password } = req.body;

  if (!firstName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }

  if (!isStrongPassword(password)) {
    throw new ApiError(
      400,
      "Password must be 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    );
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError(500, "User not found");
  }

  await sendEmail({
    email,
    emailType: "verifyEmail",
    userId: createdUser._id,
  });

  await user.save();

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        "User created successfully Please verify your email address"
      )
    );
});

//----------------------------------------------------------------------------------------------------------------------------

//verifyEmail function---------------------------------------------------------------------------------------------------------

export const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      throw new ApiError(400, "Invalid token");
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }

    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json(new apiResponse(200, "Email verified successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
});

//----------------------------------------------------------------------------------------------------------------------------

//clearing unverified users---------------------------------------------------------------------------------------------------

const clearExpiredTokens = async () => {
  try {
    const expiredUsers = await User.find({
      verifyTokenExpire: { $lt: new Date() },
    });

    await Promise.all(
      expiredUsers.map(async (user) => {
        user.verifyToken = undefined;
        user.verifyTokenExpire = undefined;
        await user.save();
      })
    );
  } catch (error) {
    console.error("Error clearing expired verification tokens:", error);
  }
};

//at 00:00 everyday
schedule.scheduleJob("0 0 * * *", clearExpiredTokens);

//----------------------------------------------------------------------------------------------------------------------------

//SignIn function-------------------------------------------------------------------------------------------------------------

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Wrong password");
  }

  if (!user.isVerified) {
    throw new ApiError(401, "Please verify your email address");
  }

  const { accessToken, refreshToken } = await generate_Access_Refresh_Token(
    user._id
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//----------------------------------------------------------------------------------------------------------------------------

//googleSignIn function-------------------------------------------------------------------------------------------------------

export const google = asyncHandler(async (req, res) => {
  const { name, email, googlePhoto, isVerified, isAnonymous } = req.body;

  const displayName = name.split(" ");
  const firstName = displayName[0];
  const lastName = displayName.slice(1).join("");
 
  if (!email || !firstName) {
    throw new ApiError(400, "All fields are required");
  }

  if (isAnonymous) {
    throw new ApiError(400, "Anonymous user not allowed");
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      const { accessToken, refreshToken } = await generate_Access_Refresh_Token(
        user._id
      );

      const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
          new apiResponse(
            200,
            {
              user: loggedUser,
              accessToken,
              refreshToken,
            },
            "User logged in successfully"
          )
        );
    } else {
      const password = generateRandomPassword(10);

      const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        image: googlePhoto,
      });

      if (!isVerified) {
        await sendEmail({
          email,
          emailType: "verifyEmail",
          userId: newUser._id,
        });
      } else {
        newUser.isVerified = true;
        await newUser.save();
      }

      const { accessToken, refreshToken } = await generate_Access_Refresh_Token(
        newUser._id
      );

      const loggedUser = await User.findById(newUser._id).select(
        "-password - refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
          new apiResponse(
            201,
            {
              user: loggedUser,
              accessToken,
              refreshToken,
            },
            "User created successfully "
          )
        );
    }
  } catch (error) {
   
    return res
      .status(500)
      .json(new apiResponse(500, null, "Internal Server Error"));
  }
});

//----------------------------------------------------------------------------------------------------------------------------

//forgotPassword function-----------------------------------------------------------------------------------------------------

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    sendEmail({
      email,
      emailType: "resetPassword",
      userId: user._id,
    });

    return res
      .status(200)
      .json(new apiResponse(200, "Email sent successfully to reset password"));
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
});

//----------------------------------------------------------------------------------------------------------------------------
//resetPassword function------------------------------------------------------------------------------------------------------
export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new ApiError(400, "Invalid token");
    }
  
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpire: { $gt: Date.now() },
    });
  
    user.forgotPasswordToken = undefined;
    await user.save();
  
    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }
    const loggedUser = await User.findById(user._id).select(
      "-password -refreshToken -accessToken"
    );
    return res
      .status(200)
      .json(
        new apiResponse(200, { loggedUser }, "Now you can reset your password")
      );
  } catch (error) {
    throw new ApiError(500, "Error in reseting password");
    
  }
});

//----------------------------------------------------------------------------------------------------------------------------
//updatePassword function-----------------------------------------------------------------------------------------------------
export const updatePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;
  const { email } = req.query;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!token) {
    throw new ApiError(400, "Invalid token");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  user.forgotPasswordExpire = undefined;
  user.password = password;
  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, "Password updated successfully"));
});

//----------------------------------------------------------------------------------------------------------------------------
//logOut function-------------------------------------------------------------------------------------------------------------

export const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );


  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, undefined, "Logged out successfully"));

});

// ---------------------------------------------------------------------------------------------------------------------------
// refreshToken function------------------------------------------------------------------------------------------------------
export const refreshAccessToken = asyncHandler(async(req,res,next)=>{
  const userId = req.query.UserID
   const refreshToken =  req.cookies.refreshToken;
   if(!refreshToken){
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );
  
  
    const options = {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    };
    console.log("Inside refresh token")
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, undefined, "Logged out successfully"));
  
   }
   const user = await User.findOne({ refreshToken: refreshToken });


   if(!user){
    throw new ApiError(401,"Unauthorized: User not found");
   }

  
   const {accessToken,refreshToken:newRefreshToken} = await generate_Access_Refresh_Token(user._id);
    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    const options ={
        httpOnly:true,
        secure:true
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res
    .status(200)
    .cookie("refreshToken",newRefreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(new apiResponse(200,{user:loggedUser,accessToken,refreshToken},"Token refreshed successfully"));



})

// ---------------------------------------------------------------------------------------------------------------------------

// UpdateProfile

export const updateProfile = asyncHandler(async (req, res,next) => {

  if(req.user._id.toString() !== req.params.userId){
    throw new ApiError(401, "Unauthorized");
  }

  const { firstName, lastName, password,gender } = req.body;
  if (password) {
    if (!isStrongPassword(password)) {
      throw new ApiError(
        400,
        "Password must contain a-z,A-Z,0-9, special character and length must be greater than 8"
      );
    }
  }

try {
  const updateFields = {
    firstName :req.body.firstName,
    lastName : req.body.lastName,
    password:password,
    gender:gender
  }


const updateUser = await User.findByIdAndUpdate(
  req.params.userId,
  {
    $set:updateFields
  },
  {
    new:true
  }
)

const loggedInUser = await User.findById(req.user._id).select(
  "-password -refreshToken"
);

const options = {
  httpOnly: true,
  secure: true,
};

return res
  .status(200)
  .json(
  new apiResponse(
      200,
      {
      user: loggedInUser,
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken
      },
      "Updated successfully",

  )
    
  ); 

}
catch(error){
  next(error)
}

});


// ---------------------------------------------------------------------------------------------------------------------------
// DeleteProfile

export const deleteUser = asyncHandler(async (req, res,next) => {
  if(req.user._id.toString() !== req.params.userId){
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findByIdAndDelete(req.params.userId);

  if(!user){  
    throw new ApiError(404, "User not found");
  }

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  return res
  .status(200)
  .json(new apiResponse(200, "User deleted successfully"));
}
);

// ---------------------------------------------------------------------------------------------------------------------------
// GetProfile
export const getUsers = asyncHandler(async (req, res) => {
  try {
    
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
      throw new ApiError(403, "Unauthorized");
    }
    const users = await User.find({}).select("-password -refreshToken");
    return res
    .status(200)
    .json(new apiResponse(users, "User Fetched Successfully", 200));

  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
}
);

export const deleteUserById = asyncHandler(async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
      throw new ApiError(403, "Unauthorized");
    }
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new apiResponse(200, "User deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
}
);
