import Menu from "../models/menu.model.js";
import asyncHandler from "../helper/asyncHandler.js";
import apiResponse from "../helper/apiResponse.js";
import ApiError from "../helper/apiError.js";
import User from "../models/user.model.js";
import WhistList from "../models/whistlist.model.js";


export const addToWhistList = asyncHandler(async (req, res) => {
    try {
        const menuId = req.params.menuId;
        const userId = req.params.userId;

        
        if (!userId) {
            throw new ApiError(400, "Please login to add menu to whistlist");
        }
        if (!menuId) {
            throw new ApiError(400, "Menu id is required");
        }
        
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new ApiError(404, "Menu not found");
        }

        const menuInWhistList = await WhistList.findOne({ user: userId, menu: menuId });
        
        
        if (menuInWhistList) {
            const result = await WhistList.updateOne(
              { user: userId }, 
              { $pull: { menu: menuId } } // Removes the specific menu ID
            );
            return res.status(200).json(new apiResponse(200, "Menu removed from wishlist successfully"));
          }
          

        const userWhist = await WhistList.findOne({ user: userId });

        if (!userWhist) {
            await WhistList.create({
                user: userId,
                menu: menuId
            });
        }

            else {
                userWhist.menu.push(menuId);
                await userWhist.save();
            }

           
            
            return res.status(201).json(new apiResponse(201, "Menu added to whistlist successfully"));
        
        
       
    }
    catch (error) {
        throw new ApiError(500, error.message);
    }
});


export const status = asyncHandler(async (req, res) => {
    try {
      const userId = req.params.userId;
      const menuId = req.params.menuId;
  
     
     
      const userWhist = await WhistList.findOne({ user: userId });
      if (!userWhist) {
        return res.status(404).json(new apiResponse(404, "Wishlist not found"));
      }
    
      const menuIds = userWhist.menu;
      const normalizedMenuIds = menuIds.map(id => id.toString());




const menuStatus = normalizedMenuIds.includes(menuId); 

      
      if (!menuStatus) {
        return res.status(200).json(new apiResponse(200, "Menu is not in wishlist", { status: false }));
      }

  
      return res.status(200).json(new apiResponse(200, "Menu is in wishlist", { status: true }));
  
    } catch (error) {
     
      return res.status(500).json(new apiResponse(500, error.message)); // Return 500 status
    }
  });
  
export const  getWhistList = asyncHandler(async(req,res)=>{
    try {
        
        const userId = req.params.userId;
        const userWishlist = await WhistList.findOne({ user: userId })

       
        
        if (!userWishlist ) {
          throw new ApiError("Wishlist is empty or 'menus' is not an array");
        }

        const menuIds = userWishlist.menu; 
        const menus = await Menu.find({ _id: { $in: menuIds } });
        return res
        .status (200)
        .json(new apiResponse(
            200,
            {
                menus
            },
            "Whistlist found successfully"
        ))

        

    } catch (error) {
        throw new ApiError(500, "No wishList found, please add" );
    }
})