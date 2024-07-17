import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Rating } from "flowbite-react";
import { FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { BiCheckboxSquare } from "react-icons/bi";
import {
  updateFail,
  updateSuccess,
  clearError,
} from "../../../Redux/User-Slice/userSlice";
import { set } from "mongoose";
import {
  addToCartStart,
  addToCartSuccess,
  addToCartFail,
} from "../../../Redux/Cart-slice/cartSlice";

function MenuSlug() {
  const [menuData, setMenuData] = useState({});
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { menuSlug } = useParams();
  const dispatch = useDispatch();

  const [updateMessage, setUpdateMessage] = useState("");
  const [wishList, setWishList] = useState(false);

  const { cart } = useSelector((state) => state.cart);

  //to get the menu data
  useEffect(() => {
    try {
      const fetchMenu = async () => {
        // Getting Menu
        const res = await fetch(`/api/menu/getMenu?slug=${menuSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message);
        } else {
          setMenuData(data.message.menu.menus[0]);
        }
      };

      fetchMenu();
    } catch (error) {
      setError(error.message);
    }
  }, [menuSlug]);

  //to fetch wishlist
  useEffect(() => {
    try {
      const fetchWishList = async () => {
        const resWish = await fetch(
          `/api/whistList/getStatus/${currentUser?.message?.user?._id}/${menuData._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!resWish.ok) {
          const data = await resWish.json();
          setError(data.error);
          return;
        }

        const dataWish = await resWish.json();
        setWishList(dataWish.status.status);
      };
      fetchWishList();
    } catch (error) {
      setError(error.message);
    }
  }, [menuData]);

  //to handle wishlist
  const handleWishlist = async () => {
    try {
      const newStatus = !wishList;
      setWishList(newStatus);
      const res = await fetch(
        `/api/whistList/addWhistList/${currentUser?.message?.user?._id}/${menuData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      const data = await res.json();

      setUpdateMessage(data.message);
      setTimeout(() => {
        setUpdateMessage(null);
        setError(null);
      }, 4000);
    } catch (error) {
      setError(error.message);
    }
  };

  //to add to cart
  const handleCart = async () => {
    try {
      const refreshToken = currentUser?.message?.refreshToken;
      const refreshRes = await fetch(
        `/api/auth/refreshToken?refresh=${refreshToken}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const dataRefresh = await refreshRes.json();
      if (!refreshRes.ok) {
        const data = await refreshRes.json();
        dispatch(updateFail(data.error));
        setUpdateMessage("Please clear cookies and sign in again");
        setTimeout(() => {
          setUpdateMessage(null);
          dispatch(clearError());
        }, 4000);
        return;
      }

      dispatch(updateSuccess(dataRefresh));

      dispatch(addToCartStart());
      const res = await fetch(
        `/api/cart/addToCart/${currentUser?.message?.user?._id}/${menuData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        dispatch(addToCartSuccess(data));
        setUpdateMessage("Menu added to cart successfully");
        setTimeout(() => {
          setUpdateMessage(null);
        }, 4000);
        return;
      } else {
        dispatch(addToCartFail(data.message));
        setError("Menu already in cart");
        setTimeout(() => {
          setError(null);
        }, 4000);
        return;
      }
    } catch (error) {
      setError("Error whiling adding menu to cart");
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  //to remove from cart
  const handleRemoveCart = async () => {
    try {
      dispatch(addToCartStart());
      const res = await fetch(
        `/api/cart/remove/${currentUser?.message?.user?._id}/${menuData._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        dispatch(addToCartSuccess(data));
        setUpdateMessage("Menu removed from cart successfully");
        setTimeout(() => {
          setUpdateMessage(null);
        }, 4000);
        return;
      } else {
        dispatch(addToCartFail(data.message));
        setError("Error while removing menu from cart");
        setTimeout(() => {
          setError(null);
        }, 4000);
        return;
      }
    } catch (error) {
      setError("Error while removing menu from cart");
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  useEffect(() => {
    if (!cart.data || cart?.data?.menus?.length == 0) {
      try {
        const fetchCart = async () => {
          const res = await fetch(
            `/api/cart/getCart/${currentUser?.message?.user?._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          if (res.ok) {
            dispatch(addToCartSuccess(data));
          } else {
            dispatch(addToCartFail(data.message));
          }
        };
        fetchCart();
      } catch (error) {
        setError("Error while fetching cart");
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
    }
  }, [cart?.data?.menus.length, currentUser?.message?.user?._id, menuSlug]);

  const discounted = 100 - menuData?.menuDiscount;
  const price = (menuData?.menuPrice * discounted) / 100;

  return (
    <section className="overflow-hidden bg-zinc-50">
      <div className="mx-auto max-w-5xl px-5 py-24">
        <div className="mx-auto flex flex-wrap items-center md:w-3/5  lg:w-4/5">
          <img
            alt="Menu Image"
            className="h-3/4 w-full rounded object-cover md:h-3/4  lg:h-3/5 lg:w-1/2"
            src={menuData?.menuImage}
          />
          <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:pl-10">
            <h2 className="text-sm  font-semibold tracking-widest text-gray-500">
              {menuData?.menuCategory}
            </h2>
            <div className="flex items-center justify-between md:justify-normal gap-6 my-auto">
              <h1 className="text-3xl font-semibold text-gray-800">
                {menuData?.menuName}
              </h1>
              <FaHeart
                className={`h-6 w-6 cursor-pointer ${
                  wishList ? "text-red-500" : "text-gray-400"
                }`}
                onClick={handleWishlist}
                title={wishList ? "Remove from wishlist" : "Add to wishlist"}
              />
            </div>

            {/* TO DO RATING  */}
            <div className="my-4 flex items-center">
              <Rating>
                <Rating.Star />
                <Rating.Star />
                <Rating.Star />
                <Rating.Star />
                <Rating.Star filled={false} />
                <p className="ml-2 text-sm font-medium text-gray-500">
                  4.95 out of 5
                </p>
              </Rating>
            </div>
            <p className="leading-relaxed">{menuData?.menuDescription}</p>
            <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
              <div className="flex items-center">
                {menuData?.menuType === "veg" ? (
                  <span className="text-base font-semibold text-green-600 flex items-center">
                    Pure-Veg
                    <BiCheckboxSquare className=" mt-1 ml-1 h-6 w-6" />
                  </span>
                ) : (
                  <span className="text-base font-semibold text-red-600 flex items-center">
                    Non-Veg
                    <BiCheckboxSquare className=" mt-1 ml-1 h-6 w-6" />
                  </span>
                )}
              </div>
              <div className="ml-auto flex items-center">
                <div className="relative">
                  {menuData?.menuStatus === "In Stock" ? (
                    <span className="text-base font-semibold text-gray-900">
                      In Stock
                    </span>
                  ) : (
                    " "
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-500">
                  {menuData?.menuDiscount}% off
                </span>
                <span className="text-xl font-bold text-green-600">
                  ₹{menuData?.discountPrice || price}
                </span>
                <span className="text-gray-500 line-through">
                  ₹{menuData?.menuPrice}{" "}
                </span>
              </div>

              {/* TO DO ADD TO CART BUTTON */}
              {cart?.data?.menus.find((m) => m.menu === menuData._id) ? (
                <button
                  type="button"
                  className="rounded-md bg-[#E52A3D] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  onClick={handleRemoveCart}
                >
                  Remove from Cart
                </button>
              ) : menuData?.menuStatus === "Out of Stock" ? (
                <p className="rounded-md  px-3 py-2 text-md font-semibold text-red-600  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                  Out of Stock
                </p>
              ) : (
                <button
                  type="button"
                  className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E52A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  onClick={handleCart}
                >
                  Add To Cart
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="text-center mx-auto text-red-600 p-3 py-5 rounded-md">
              {error}
            </div>
          )}
          {updateMessage && (
            <div className="text-center mx-auto text-green-600 p-3 py-5 rounded-md">
              {updateMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MenuSlug;
