import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { PiNotebookFill } from "react-icons/pi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaArrowUp, FaBookReader, FaChevronUp } from "react-icons/fa";
import { FaPencilRuler } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { BiSolidFoodMenu } from "react-icons/bi";
import { CgMenuBoxed } from "react-icons/cg";
import { FaCaretRight } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { BsPersonVcard } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { MdRocketLaunch } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { MdOutlineTableBar } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import Sidebar from "../Profile/Sidebar";

function SidebarDashboard() {
  const [showDropDown, setShowDropdown] = useState(false);
  const [customerDropDown, setcustomerDropDown] = useState(false);
  const [orderDropDown, setOrderDropDown] = useState(false);
  const [tableDropDown, setTableDropDown] = useState(false);
  const [tab, setTab] = useState("");
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const myParam = urlParams.get("tab");
    if (myParam) {
      setTab(myParam);
    }
  }, [location.search]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
  };
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {currentUser.message.user.isAdmin && (
        <div
          className="md:hidden flex  bg-zinc-50 items-center justify-center gap-2"
          onClick={toggleMenu}
        >
          <h2 className="text-base font-sans bg-zinc-50 font-semibold">
            {isMenuOpen ? "Hide Dashboard" : "Show Dashboard"}
          </h2>
          {isMenuOpen ? (
            <FaChevronUp
              className="h-4 w-4 cursor-pointer text-gray-900 hover:text-orange-200"
            />
          ) : (
            <FaChevronRight
              className="h-4 w-4 cursor-pointer text-gray-900 hover:text-orange-200"
            />
          )}
        </div>
      )}

   
<aside className={` ${isMenuOpen ? '' : 'hidden'} bg-zinc-50 flex h-screen w-64 flex-col overflow-y-auto px-2 py-4 pb-8 ${currentUser.message.user.isAdmin ? 'md:flex' : 'hidden'}`}>



          <div className="p-6 flex flex-1 flex-col bg-white shadow-2xl border  rounded-lg justify-between">
            <nav className="-mx-3 space-y-6 ">
              {/* Dashboard */}
              {currentUser.message.user.isAdmin && (
                <div className="mx-4 flex flex-col gap-2">
                  <NavLink
                    to={"/dashboard?tab=dashboard"}
                    className={` font-heading_font cursor-pointer flex transform items-center rounded-lg gap-2  text-gray-600 hover:bg-gray-100 hover:text-gray-700  hover:px-3 hover:py-2
                hover:underline ${
                  tab === "dashboard"
                    ? "bg-gray-200 px-3 py-2  text-gray-800"
                    : ""
                }`}
                  >
                    <MdDashboard
                      className="h-5 w-5 inline-block text-gray-600 "
                      aria-hidden="true"
                    />
                    <h1 className="ml-2 text-gray-600 ">Dashboard</h1>
                  </NavLink>
                </div>
              )}

              {/* Order */}
              {currentUser.message.user.isAdmin && (
                <div className="mx-4 flex flex-col gap-2">
                  <button
                    className="flex font-heading_font  items-center cursor-pointer"
                    onClick={() => setOrderDropDown(!orderDropDown)}
                  >
                    <MdRocketLaunch
                      className="h-5 w-5 inline-block text-gray-600 "
                      aria-hidden="true"
                    />
                    <h1 className="ml-2 text-gray-600 ">Order</h1>
                    <FaCaretRight
                      className="h-5 w-5 ml-6 text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                  {orderDropDown && (
                    <div className="pl-8">
                      <NavLink
                        to="/dashboard?tab=orderList"
                        className={`flex transform items-center rounded-lg gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                          tab === "orderList" ? "bg-gray-200 text-gray-800" : ""
                        }`}
                      >
                        <span className="text-sm font-medium">Order List</span>
                      </NavLink>
                      {/* <NavLink
                        to="/dashboard?tab=orderID"
                        className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                          tab === "orderID" ? "bg-gray-200 text-gray-800" : ""
                        }`}
                      >
                        <span className=" text-sm font-medium">Order ID</span>
                      </NavLink> */}
                    </div>
                  )}
                </div>
              )}

              {/* Menu */}
              {currentUser.message.user.isAdmin && (
                <div className="mx-4 flex flex-col gap-2">
                  <button
                    className="flex font-heading_font  items-center cursor-pointer"
                    onClick={() => setShowDropdown(!showDropDown)}
                  >
                    <BiSolidFoodMenu
                      className="h-5 w-5 inline-block text-gray-600 "
                      aria-hidden="true"
                    />
                    <h1 className="ml-2 text-gray-600 ">Menu</h1>
                    <FaCaretRight
                      className="h-5 w-5 ml-6 text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                  {showDropDown && (
                    <div className="pl-8">
                      <NavLink
                        to="/dashboard?tab=createMenu"
                        className={`flex transform items-center rounded-lg gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                          tab === "createMenu"
                            ? "bg-gray-200 text-gray-800"
                            : ""
                        }`}
                      >
                        <span className="text-sm font-medium">Create Menu</span>
                      </NavLink>
                      <NavLink
                        to="/dashboard?tab=updateMenu"
                        className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                          tab === "updateMenu"
                            ? "bg-gray-200 text-gray-800"
                            : ""
                        }`}
                      >
                        <span className=" text-sm font-medium">
                          Update Menu
                        </span>
                      </NavLink>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------------------------------- */}

              {/* Customer */}
              {currentUser.message.user.isAdmin && (
                <div className="mx-4 flex flex-col gap-2">
                  <button
                    className="flex font-heading_font  items-center cursor-pointer"
                    onClick={() => setcustomerDropDown(!customerDropDown)}
                  >
                    <BsPersonVcard
                      className="h-5 w-5 inline-block text-gray-600 "
                      aria-hidden="true"
                    />
                    <h1 className="ml-2 text-gray-600 ">Customers</h1>
                    <FaCaretRight
                      className="h-5 w-5 ml-6 text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                  {customerDropDown && (
                    <div className="pl-8">
                      <NavLink
                        to="/dashboard?tab=customerList"
                        className={`flex transform items-center rounded-lg gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                          tab === "customerList"
                            ? "bg-gray-200 text-gray-800"
                            : ""
                        }`}
                      >
                        <span className="text-sm font-medium">
                          Customer List
                        </span>
                      </NavLink>
                      <NavLink
                        to="/dashboard?tab=reviews"
                        className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                          tab === "reviews" ? "bg-gray-200 text-gray-800" : ""
                        }`}
                      >
                        <span className=" text-sm font-medium">Reviews</span>
                      </NavLink>
                    </div>
                  )}
                </div>
              )}

              {/* Analytic */}

              {currentUser.message.user.isAdmin && (
                <div className="mx-4 flex flex-col gap-2">
                  <NavLink
                    to={"/dashboard?tab=analytic"}
                    className={` font-heading_font cursor-pointer flex transform items-center rounded-lg gap-2  text-gray-600 hover:bg-gray-100 hover:text-gray-700 hover:px-3 hover:py-2
                hover:underline ${
                  tab === "analytic"
                    ? "bg-gray-200 text-gray-800 px-3 py-2"
                    : ""
                }`}
                  >
                    <GoGraph
                      className="h-5 w-5 inline-block text-gray-600 "
                      aria-hidden="true"
                    />
                    <h1 className="ml-2 text-gray-600 ">Analytic</h1>
                  </NavLink>
                </div>
              )}

              {/* Table */}
              {currentUser.message.user.isAdmin && (
                <div className="mx-4 flex flex-col gap-2">
                  <button
                    className="flex font-heading_font  items-center cursor-pointer"
                    onClick={() => setTableDropDown(!tableDropDown)}
                  >
                    <MdOutlineTableBar
                      className="h-5 w-5 inline-block text-gray-600 "
                      aria-hidden="true"
                    />
                    <h1 className="ml-2 text-gray-600 ">Table</h1>
                    <FaCaretRight
                      className="h-5 w-5 ml-6 text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                  {tableDropDown && (
                    <div className="pl-8">
                     
                      <NavLink
                        to="/dashboard?tab=tableList"
                        className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                          tab === "tableList" ? "bg-gray-200 text-gray-800" : ""
                        }`}
                      >
                        <span className=" text-sm font-medium">Table List</span>
                      </NavLink>
                     
                    </div>
                  )}
                </div>
              )}
            </nav>
            <div className="mt-20">
              <div className="rounded-lg bg-gray-100 px-1 py-3 ">
                <h2 className="text-sm font-medium text-gray-800">
                  New feature availabel!
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
                  harum officia eligendi velit.
                </p>
                <img
                  className="mt-2 h-32 w-full rounded-lg object-cover"
                  src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1806&q=80"
                  alt="Feature"
                />
              </div>

              {/* Profile */}
              <div className="mt-6 flex items-center justify-between">
                <Link
                  to="/account?pro=profile"
                  className="flex items-center gap-x-2"
                >
                  {currentUser?.message?.user?.image ? (
                    <img
                      src={currentUser.message.user.image}
                      alt="User Cover Image"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <BsPersonCircle className="h-10 w-10 text-gray-400 rounded-full" />
                  )}
                  <div className="flex flex-col ">
                    <span className="block text-xs font-semibold text-gray-800">
                      Hello Admin!!
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser?.message?.user?.firstName}{" "}
                      {currentUser?.message?.user?.lastName}
                    </span>
                  </div>
                </Link>

                <a
                  href="#"
                  className="rotate-180 text-gray-800 transition-colors duration-200 hover:text-gray-900"
                >
                  {/* <LogIn className="h-5 w-5" /> */}
                </a>
              </div>
            </div>
          </div>
        </aside>
    
    </>
  );
}

export default SidebarDashboard;
