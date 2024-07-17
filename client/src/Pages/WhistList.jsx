import React from "react";

import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { updateFail, updateSuccess, clearError, } from '../Redux/User-Slice/userSlice'

import { addToCartStart, addToCartSuccess, addToCartFail } from '../Redux/Cart-slice/cartSlice';
import { useSelector, useDispatch } from "react-redux";


function WhistList() {
  const [menu1, setMenus] = useState([]);
  const [fullMenu, setFullMenu] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const menuSlug = location.pathname.split("/")[2];
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   try {
  //     const urlParams =new URLSearchParams(location.search);

  //     urlParams.set('searchTerm', searchValue)

  //     const search = urlParams.toString()
  //     navigate(`/search?${search}`)
  //   } catch (error) {
  //     console.log("Error fetching search:", error);
  //   }
  // }
  const {cart} = useSelector((state) => state.cart)
const [updateMessage, setUpdateMessage] = useState(null);



  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch(
        `/api/whistList/getWhistList/${currentUser?.message?.user?._id}`
      );
      const data = await res.json();
      if (res.ok) {
        setMenus(data.message.menus);
        setFullMenu(data.message.menu);
      }
    };
    fetchMenu();
  }, [currentUser?.message?.user?._id]);


  

  const handleCart = async (itemId) => {
    try {
     
      dispatch(addToCartStart());


      const res = await fetch(
        `/api/cart/addToCart/${currentUser?.message?.user?._id}/${itemId}`,
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

  const handleRemoveCart = async (itemId) => {
    try {
      dispatch(addToCartStart());
      const res = await fetch(
        `/api/cart/remove/${currentUser?.message?.user?._id}/${itemId}`,
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
    if (cart.length == 0) {
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
  }, [cart.length, currentUser?.message?.user?._id, menuSlug]);

  return (
    <>
      {menu1.length > 0 ? (
        <div>
          <div className="mx-auto max-w-7xl bg-zinc-50 px-2 ">
            <div className="flex flex-col space-y-8 pb-10 pt-12 px-2 md:pt-24">
              <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
                My Wishlist
              </p>
            </div>

            <div className="grid mx-2  gap-6 gap-y-10 py-6 md:grid-cols-1 lg:grid-cols-3 ">
              {menu1.map((me) => (
                <div
                  key={me._id}
                  className=" border cursor-pointer mx-2   bg-gray-50  rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-1.02"
                >
                  <Link to={`/menu/${me.slug}`}>
                    <img
                      src={me.menuImage}
                      className=" px-3   w-full rounded-md"
                      alt="Menu Image"
                    />
                    <div className="min-h-min ">
                      <p className="mt-4 flex-1 text-2xl font-bold pb-4 text-gray-900 text-center ">
                        {me.menuName}
                      </p>
                      <p className=" text-gray-600 text-center px-4 w-full text-sm leading-normal ">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: `${me.menuDescription.slice(0, 180)}...`,
                          }}
                        />
                      </p>
                      <div className="flex py-4 items-center justify-around">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-500">
                            {me.menuDiscount}% off
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            ₹{me.discountPrice}
                          </span>
                          <span className="text-gray-500 line-through">
                            ₹{me.menuPrice}{" "}
                            {/* Original price with strikethrough */}
                          </span>
                        </div>
                        {cart?.status?.cartData?.menus?.find(
                (m) => m.menu === me._id
              ) ? (
                <button
                  type="button"
                  className="rounded-md bg-[#E52A3D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  onClick={() => handleRemoveCart(me._id)}
                >
                  Remove from Cart 
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E52A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  onClick={() => handleCart(me._id)} 
                >
                  Add to Cart
                </button>
              )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col mx-auto items-center justify-center h-screen">
          <p className="text-2xl font-bold text-gray-900">
            Your Wishlist is empty
          </p>
          <Link
            to="/menu"
            className="px-3 py-2 mt-4 bg-[#E52A3D] text-white font-semibold rounded-md shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Explore Menu
          </Link>
        </div>
      )}
    </>
  );
}

export default WhistList;
