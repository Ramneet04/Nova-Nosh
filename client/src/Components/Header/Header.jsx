import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import { BsPersonCircle } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { MdOutlineTableBar } from "react-icons/md";

import { BsPencil } from "react-icons/bs";
import { signOutSuccess } from "../../Redux/User-Slice/userSlice";
import { resetAddress } from "../../Redux/User-Slice/addressSlice";
import {
  updateFail,
  updateSuccess,
  clearError,
} from "../../Redux/User-Slice/userSlice";
import { useDispatch } from "react-redux";
import { current } from "@reduxjs/toolkit";
import { resetCart } from "../../Redux/Cart-slice/cartSlice";

const menuItems = [
  {
    name: "Home",
    href: "/",
  },

  {
    name: "About",
    href: "/about",
  },
  {
    name: "Menu",
    href: "/menu",
  },
  {
    name: "Orders ",
    href: "/orderStatus",
  },
  {
    name: "Book Table",
    href: "/reservations",
  },

  {
    name: "Contact Us",
    href: "/contact",
  },
];

const mobileMenuItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Menu",
    href: "/menu",
  },
  {
    name: "Cart",
    href: "/cart",
  },
  {
    name: "Wishlists",
    href: "/account?pro=wishlist",
  },
  {
    name: "Book Table",
    href: "/reservations",
  },

  {
    name: "Orders ",
    href: "/orderStatus",
  },
  {
    name: "My Table",
    href: "/account?pro=myTable",
  },
  {
    name: "My Address",
    href: "/account?pro=address",
  },

  {
    name: "Contact Us",
    href: "/contact",
  },
  {
    name: "About",
    href: "/about",
  },
];

import { useNavigate } from "react-router-dom";
function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [showDropdown, setShowDropdown] = React.useState(false);

  const [error, setError] = useState(" ");

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const userID = currentUser?.message?.user?._id;
    try {
      const refreshRes = await fetch(
        `/api/auth/refreshToken?userID=${userID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const dataRefresh = await refreshRes.json();
      if (!refreshRes.ok) {
        const data = await refreshRes.json();
        dispatch(updateFail(data.error));

        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
        return;
      }

      dispatch(updateSuccess(dataRefresh));
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        setError(error.message);
      }
      dispatch(signOutSuccess()),
        dispatch(resetAddress()),
        dispatch(resetCart()),
        navigate("/");
    } catch (error) {
      setError(error.message);
      dispatch(signOutSuccess()),
        dispatch(resetAddress()),
        dispatch(resetCart()),
        navigate("/");
    }
  };

  const { cart } = useSelector((state) => state.cart);
  const totalItems = cart?.data?.totalQuantity;
  return (
    <div className="relative bg-zinc-50 w-full ">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2 ">
          <Link
            to="/"
            className={`whitespace-nowrap self-center font-logo_font text-black text-sm sm:text-xl font-semibold`}
          >
            <span className="px-2 py-1 font-logo_font   text-[#E52A3D] rounded-lg">
              NOVA
            </span>
            NOSH
          </Link>
        </div>
        <div className="hidden lg:block">
          <ul className="inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-base font-logo_font font-thin  text-gray-800 hover:text-[#E52A3D] hover:border-b-2 hover:border-[#E52A3D] py-2 transition duration-300 ease-in-out"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden  lg:flex lg:items-center lg:justify-end">
          <div className="hidden lg:block rounded-full p-3">
            <Link className="relative" to="/cart">
              <HiOutlineShoppingCart className="h-6 w-6 cursor-pointer" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E52A3D] text-white text-xs rounded-full px-1 ">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Sign In ................................ */}
          <div className="mt-4 lg:mt-0 lg:ml-4 flex items-center justify-end">
            {currentUser ? (
              <div className="relative inline-block">
                <button
                  type="button"
                  className="focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-gray-400 rounded-full hover:bg-gray-100 p-2"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {currentUser.message.user.image ? (
                    <img
                      src={currentUser.message.user.image}
                      alt="User Cover Image"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <BsPersonCircle className="h-10 w-10 text-gray-400 rounded-full" />
                  )}
                </button>

                {showDropdown && (
                  <div
                    className="absolute top-full right-0 z-50 bg-white shadow-md rounded-md w-auto px-2 overflow-hidden transition-all duration-200 ease-in-out transform translate-y-1 "
                    style={{
                      opacity: showDropdown ? 1 : 0,
                      pointerEvents: showDropdown ? "auto" : "none",
                    }}
                  >
                    <div className="px-8 py-2 flex flex-col items-start">
                      <div className="space-y-2">
                        {currentUser.message.user.isAdmin ? (
                          <Link
                            to="/dashboard?tab=dashboard"
                            className="text-gray-800 hover:text-gray-600 p-2 flex items-center space-x-2"
                            onClick={() => setShowDropdown(false)}
                          >
                            <MdDashboardCustomize className="text-xl" />
                            <span className="whitespace-nowrap">Dashboard</span>
                          </Link>
                        ) : (
                          <Link
                            to="/account?pro=profile"
                            className="text-gray-800 hover:text-gray-600 p-2 flex items-center space-x-2"
                          >
                            <IoPersonOutline className="text-xl mx-3" />
                            Profile
                          </Link>
                        )}

                        {currentUser.message.user.isAdmin ? null : (
                          <Link
                            to="/orderStatus"
                            className="text-gray-800 hover:text-gray-600 p-2 flex items-center space-x-2"
                          >
                            <GoPackage className="text-xl mx-3" />
                            Orders
                          </Link>
                        )}

                        {currentUser.message.user.isAdmin ? null : (
                          <Link
                            to="/account?pro=wishlist"
                            className="text-gray-800 hover:text-gray-600 p-2 flex items-center space-x-2"
                          >
                            <CiHeart className="text-2xl font-semibold mx-3" />
                            Wishlist
                          </Link>
                        )}

                        {currentUser.message.user.isAdmin ? null : (
                          <Link
                            to="/account?pro=myTable"
                            className="text-gray-800 hover:text-gray-600 p-2 flex items-center space-x-2"
                          >
                            <MdOutlineTableBar className="text-2xl font-semibold mx-3" />
                            Table
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="text-red-500 hover:text-red-700 p-2 flex items-center space-x-2"
                        >
                          <IoIosLogOut className="text-2xl mx-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signIn">
                <button
                  type="button"
                  className="rounded-md px-4 py-2 bg-[#E52A3D] text-white hover:bg-black hover shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-white font-semibold text-sm"
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex lg:hidden gap-6 justify-around">
          <div className=" lg:hidden rounded-full ">
            <Link className="relative" to="/cart">
              <HiOutlineShoppingCart className="h-6 w-6 cursor-pointer" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E52A3D] text-white text-xs rounded-full px-1 ">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          <div className="lg:hidden">
            <IoMdMenu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
          </div>
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden justify-end">
            <div className="bg-black opacity-25 fixed inset-0"></div>
            <div className="relative flex flex-col w-64 bg-white">
              <div className="flex items-center justify-between p-4 bg-gray-100">
                {/* Logo */}

                {currentUser ? (
                  currentUser.message.user.isAdmin ? (
                    <Link to="/dashboard?tab=dashboards">
                      <div className="flex gap-2 mr-2 items-center">
                        {currentUser.message.user.image ? (
                          <img
                            src={currentUser.message.user.image}
                            alt="User Cover Image"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <BsPersonCircle className="h-6 w-6 text-gray-400 rounded-full" />
                        )}
                        <div>
                          <span className="block text-sm font-semibold text-gray-800">
                            {currentUser.message.user.firstName}{" "}
                            {currentUser.message.user.lastName}
                          </span>
                          <span className="block text-xs text-gray-600">
                            {currentUser.message.user.email}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link to="/account?pro=profile">
                      <div className="flex gap-2 items-center ">
                        {currentUser.message.user.image ? (
                          <img
                            src={currentUser.message.user.image}
                            alt="User Cover Image"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <BsPersonCircle className="h-7 w-7 text-gray-400 rounded-full" />
                        )}
                        <div>
                          <span className="block text-sm font-semibold text-gray-800">
                            {currentUser.message.user.firstName}{" "}
                            {currentUser.message.user.lastName}
                          </span>
                          <span className="block text-xs text-gray-600">
                            {currentUser.message.user.email}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                ) : (
                  <Link
                    to="/"
                    className={`whitespace-nowrap self-center font-logo_font text-black text-sm sm:text-xl font-semibold`}
                  >
                    <span className="px-2 py-1 font-logo_font text-[#E52A3D] rounded-lg">
                      NOVA
                    </span>
                    NOSH
                  </Link>
                )}

                <button
                  type="button"
                  onClick={toggleMenu}
                  className="text-black hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <span className="sr-only">Close menu</span>
                  <MdOutlineRestaurantMenu
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <nav className="flex-1 p-4 overflow-y-auto">
                {mobileMenuItems.map((item) => {
                  if (currentUser && !currentUser.message.user.isAdmin) {
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        onClick={toggleMenu}
                      >
                        {item.name}
                      </Link>
                    );
                  } else if (
                    !currentUser &&
                    (item.name === "Home" ||
                      item.name === "Menu" ||
                      item.name === "Wishlists" ||
                      item.name === "Book Table" ||
                      item.name === "Contact Us" ||
                      item.name === "About")
                  ) {
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        onClick={toggleMenu}
                      >
                        {item.name}
                      </Link>
                    );
                  } else {
                    return null;
                  }
                })}
              </nav>

              {/* Sign in button */}
              <div>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-4 mt-auto w-full text-sm font-semibold text-white bg-[#E52A3D]  hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to={`/signIn`}>
                    <button
                      type="button"
                      className="p-4 mt-auto w-full text-sm font-semibold text-white bg-[#E52A3D]  hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Sign-In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
