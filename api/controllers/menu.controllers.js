import Menu from "../models/menu.model.js";
import asyncHandler from "../helper/asyncHandler.js";
import apiResponse from "../helper/apiResponse.js";
import ApiError from "../helper/apiError.js";
import User from "../models/user.model.js";

export const createMenu = asyncHandler(async (req, res) => {
  try {
    const {
      menuName,
      menuDescription,
      menuPrice,
      menuImage,
      menuCategory,
      menuType,
      menuRating,
      menuDiscount,
      menuStatus,
      menuIngredients,
    } = req.body;

   
    const user = await User.findById(req.user._id);

    if (user.isAdmin === false) {
      return res
        .status(401)
        .json(new apiResponse(401, "You are not authorized to create menu"));
    }

   
    if (
      !menuName ||
      !menuDescription ||
      !menuPrice ||
      !menuImage ||
      !menuCategory ||
      !menuType
    ) {
      throw new ApiError(500, "Please fill all required fields");
    }

    const menuExists = await Menu.findOne({ menuName});

    if (menuExists) {
      throw new ApiError(400, "Menu already exists");
    }

    //Slug-generation
    
  const timestamp = new Date().getTime(); 
  const uniqueId = timestamp
  let slug = (
    uniqueId +
    "-" +
    menuType.toLowerCase() +
    "-" +
    menuName
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^a-zA-Z0-9-]/g, "")
  );

  const discountPrice = (menuPrice * (100 - menuDiscount)) / 100;
    const newMenu = await Menu.create({...req.body, slug, user: req.user._id ,  discountPrice : discountPrice})

    if (!newMenu) {
      throw new ApiError(500, "Error creating menu");
    }


    return res
      .status(201)
      .json(new apiResponse(201,{message : "Menu created successfully"},{ menu: newMenu}));

  } catch (error) {
    console.error("Error creating menu:", error.message);
    throw new ApiError(500, "Error creating menu : " + error.message);
  }
});

export const getMenu = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    let startIndex = (page - 1) * limit;
    if (req.query.startIndex) {
      startIndex = parseInt(req.query.startIndex);
    }

    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const menus = await Menu.find({
      ...(req.query.menuCategory && { menuCategory: req.query.menuCategory }),
      ...(req.query.menuType && { menuType: req.query.menuType }),
      ...(req.query.menuRating && { menuRating: req.query.menuRating }),
      ...(req.query.menuDiscount && { menuDiscount: req.query.menuDiscount }),
      ...(req.query.menuStatus && { menuStatus: req.query.menuStatus }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.menuName && { menuName: req.query.menuName }),
      ...(req.query._id && { _id: req.query._id }),

      ...(req.query.search && {
        $or: [
          {
            menuName: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            menuDescription: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            menuCategory: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            menuType: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            menuIngredients: {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalMenu = await Menu.countDocuments();
    const now = new Date();
    const one_month_ago = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthMenu = await Menu.countDocuments({
      createdAt: { $gte: one_month_ago },
    });

    return res.status(201).json(
      new apiResponse(
        201,
        {
          menu: {
            menus,
            totalMenu,
            lastMonthMenu,
          },
        },
        "Menu found successfully"
      )
    );
  } catch (error) {
    console.error("Error getting menu:", error.message);
    throw new ApiError(500, "Error getting menu : " + error.message);
  }
});

export const updateMenu = asyncHandler(async (req, res) => {
  try {
    
    if (!req.user.isAdmin && req.user._id.toString() !== req.params.userId) {
      throw new ApiError(403, "Oops !! Sorry but you are not allowed");
    }
    const Menu2 = await Menu.findById(req.params.menuId);

  
    const menuPrice = req.body.menuPrice || Menu2.menuPrice;
    const menuDiscount =req.body.menuDiscount ||  Menu2.menuDiscount;
    const discountPrice = Number((menuPrice * (100 - menuDiscount)) / 100);
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.menuId,
      {
        $set: {
          menuName: req.body.menuName,
          menuDescription: req.body.menuDescription,
          menuPrice: req.body.menuPrice,
          menuImage: req.body.menuImage,
          menuCategory: req.body.menuCategory,
          menuType: req.body.menuType,
          menuRating: req.body.menuRating,
          menuDiscount: req.body.menuDiscount,
          menuStatus: req.body.menuStatus,
          menuIngredients: req.body.menuIngredients,
           discountPrice,
        },
      },
      {
        new: true,
      }
    );
    if(!updateMenu){
      return res.status(404).json(new apiResponse(404, "Menu not found"));
    }

    return res
      .status(200)
      .json(new apiResponse(200, "Menu updated successfully",{ menu:updatedMenu}));

  } catch (error) {
    console.error("Error updating menu:", error.message);
    throw new ApiError(500, "Error updating menu");
  }
});


export const deleteMenu = asyncHandler(async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user._id.toString() !== req.params.userId) {
        throw new apiError(403, "Oops !! Sorry but you are not allowed");
        }
    
        const menu = await Menu.findByIdAndDelete(req.params.menuId);
        if(!menu){
        return res.status(404).json(new apiResponse(404, "Menu not found"));
        }
    
        return res
        .status(200)
        .json(new apiResponse(200, "Menu deleted successfully"));
    
    } catch (error) {
        console.error("Error deleting menu:", error.message);
        throw new ApiError(500, "Error deleting menu");
    }
    }
    );
