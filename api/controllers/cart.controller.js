import express from "express";
import Menu from "../models/menu.model.js";
import asyncHandler from "../helper/asyncHandler.js";
import apiResponse from "../helper/apiResponse.js";
import ApiError from "../helper/apiError.js";

import Cart from "../models/cart.model.js";

export const addToCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const menuId = req.params.menuId;
    const quantity = req.body.quantity || 1;

    
    if (!userId) {
      return res
      .status(404)
      .json(new apiResponse({}, "Please login ", 404));
    }
    if (!menuId) {
      return res
      .status(404)
      .json(new apiResponse({}, "MenuId is required", 404));
    }

    let cartData = await Cart.findOne({ user: userId }).populate("menus.menu");

    // If userCart does not exist than add new one ->
    if (!cartData) {
      const menuData = await Menu.findById(menuId);
      if (!menuData) {
        return res
        .status(404)
        .json(new apiResponse({}, "Menu Not found", 404));
      }

      cartData = await Cart.create({
        user: userId,
        menus: [{ menu: menuId, quantity, menuData }],
      });
    } else {

      //find menu ->
      const isMenuInCart = cartData.menus.find(
        (m) => m.menu._id.toString() === menuId
      );

      // If menu is already in the cart, update quantity ->
      if (isMenuInCart) {
        isMenuInCart.quantity += quantity;
      } else {
        // If menu is not in cart, add it ->
        const menuData = await Menu.findById(menuId);
        if (!menuData) {
          throw new ApiError(404, "Menu not found");
        }
        cartData.menus.push({ menu: menuId, quantity, menuData });
      }

      cartData.totalQuantity = cartData.menus.reduce(
        (total, item) => total + item.quantity,
        0
      );
      await cartData.save();
    }

    return res
      .status(201)
      .json(new apiResponse(cartData, "Menu added to cart successfully", 201));
  } catch (error) {
    throw new ApiError(500, "Error in adding quantity :- ", error);
  }
});

export const increaseQuantity = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const menuId = req.params.menuId;

    if (!userId) {
      return res
      .status(404)
      .json(new apiResponse({}, "Please login ", 404));
    }
    if (!menuId) {
      return res
      .status(404)
      .json(new apiResponse({}, "MenuId is required", 404));
    }

   
    const isMenuInCart = await Cart.find({
      user: userId,
      "menus.menu": menuId,
    });

    if (isMenuInCart.length > 0) {
      const cart = isMenuInCart[0];
      const menu = cart.menus.find((m) => m.menu.equals(menuId));
      menu.quantity += 1;
      cart.totalQuantity += 1;
      await cart.save();

      const cartData = await Cart.findOne({ user: userId });
      return res
        .status(200)
        .json(
          new apiResponse(cartData, "Menu quantity increased successfully", 201)
        );
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error increasing menu quantity");
  }
});

export const decreaseQuantity = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const menuId = req.params.menuId;

    if (!userId) {
      return res
      .status(404)
      .json(new apiResponse({}, "Please login ", 404));
    }
    if (!menuId) {return res
      .status(404)
      .json(new apiResponse({}, "MenuId is required", 404));
    }

    const menuData = await Menu.findById(menuId);

    const isMenuInCart = await Cart.find({
      user: userId,
      "menus.menu": menuId,
    });

    if (isMenuInCart.length > 0) {
      const cart = isMenuInCart[0];
      const menu = cart.menus.find((m) => m.menu.equals(menuId));
      if (menu.quantity === 1) {
        throw new ApiError(400, "Minimum quantity is 1");
      } else {
        menu.quantity -= 1;
        cart.totalQuantity -= 1;
        await cart.save();
        const cartData = await Cart.findOne({ user: userId });
        return res
          .status(200)
          .json(
            new apiResponse(
              cartData,
              "Menu quantity decreased successfully",
              200
            )
          );
      }
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error decreasing menu quantity");
  }
});

export const removeFromCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const menuId = req.params.menuId;

    if (!userId) {
      return res
      .status(404)
      .json(new apiResponse({}, "Please login ", 404));
    }
    if (!menuId) {
      return res
      .status(404)
      .json(new apiResponse({}, "MenuId is required", 404));
    }

    const isMenuInCart = await Cart.find({
      user: userId,
      "menus.menu": menuId,
    });

    if (isMenuInCart.length > 0) {
      const cart = isMenuInCart[0];
      const menu = cart.menus.find((m) => m.menu.equals(menuId));
      cart.menus.pull(menu);
      cart.totalQuantity -= menu.quantity;
      await cart.save();

      const cartData = await Cart.findOne({ user: userId });
      return res
        .status(200)
        .json(
          new apiResponse(cartData, "Menu removed from cart successfully", 200)
        );
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error removing menu from cart");
  }
});

export const getCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json(new apiResponse({}, "Please login to see cart", 400));
    }

    const userCart = await Cart.find({
      user: userId,
    });

    if (userCart.length === 0) {
      return res
        .status(404)
        .json(new apiResponse({}, "Cart is empty", 404));
    }


    const cartData = userCart[0];
    return res
      .status(200)
      .json(new apiResponse(cartData, "Cart data fetched successfully", 200));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error fetching cart data ->", error.message);
  }
});
