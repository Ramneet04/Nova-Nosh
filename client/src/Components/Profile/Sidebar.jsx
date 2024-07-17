import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateFail, updateSuccess, signOutSuccess, clearError } from "../../Redux/User-Slice/userSlice";

// Icons -------------------------------------
import { BsPersonCircle } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { resetAddress } from "../../Redux/User-Slice/addressSlice";
import { resetCart } from "../../Redux/Cart-slice/cartSlice";

import { useNavigate } from "react-router-dom";
function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [pro, setPro] = useState("");
  const [error, setError] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const myParam = urlParams.get("pro");
    if (myParam) {
      setPro(myParam);
    }
  }, [location.search]);

  const userID = currentUser?.message?.user?._id;
  const handleLogout = async () => {
    try {
     
     const refreshRes = await fetch(`/api/auth/refreshToken?userID=${userID}`, {
       method: 'GET',
       credentials: 'include',
     });
  
    const dataRefresh = await refreshRes.json();
     if (!refreshRes.ok) {
       const data = await refreshRes.json();
       dispatch(updateFail(data.error));
       
       setTimeout(() => {
        
         dispatch(clearError());
       }, 4000);
       dispatch(signOutSuccess()),
         dispatch(resetAddress()),
         dispatch(resetCart()),
         navigate("/signIn");
       return;
     }
 
     dispatch(updateSuccess(dataRefresh));
     const res = await fetch('/api/auth/logout',{
       method:"POST",
     });
 
     const data =await res.json();
     if (res.ok) {
       dispatch(signOutSuccess())
       dispatch(resetAddress())
       dispatch(resetCart())
       window.location.href = '/'
     }
     else{
       setError(error.message)
     }
    } catch (error) {
     setError(error.message)
    }
 
   }

  return (
    <aside className="md:flex hidden h-screen w-64 flex-col overflow-y-auto  bg-zinc-50  px-3 py-8">
      <div>
        <div className="flex justify-center gap-3 mx-auto px-16 rounded-md py-4 form-box bg-white shadow-sm  border items-center">
        
        <div className="flex items-center gap-3 justify-center">
  <div className="flex-shrink-0"> {/* Ensures the image doesn't grow */}
    {currentUser.message.user.image ? (
      <img
        src={currentUser.message.user.image}
        alt="User Cover Image"
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <BsPersonCircle className="h-10 w-10 text-gray-400 rounded-full" />
    )}
  </div>
  <div className="flex flex-col">
    <span className="block text-xs font-semibold text-gray-800">
      Hello !!
    </span>
    <span className="block text-base text-black font-semibold">
      {currentUser?.message?.user?.firstName}{" "}
      {currentUser?.message?.user?.lastName}
    </span>
  </div>
</div>

        </div>
      </div>

      <div className="mt-3  flex flex-1 flex-col bg-white shadow-lg rounded-md border z-30   justify-between">
        <div className="">
          <nav className="-mx-3 p-3 space-y-6 ">
            <div className="space-y-3 ">
              <label className="px-3 flex items-center gap-2  text-sm font-semibold uppercase text-gray-900">
                <BsFillPersonFill className="h-5 w-5" aria-hidden="true" />
                ACCOUNT SETTINGS
              </label>
              <NavLink
                to="/account?pro=profile"
                className={`flex transform items-center  px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                  pro === "profile" ? "bg-gray-200 text-gray-800" : ""
                }`}
              >
                <span className="mx-auto text-sm  font-medium">
                  Profile Information
                </span>
              </NavLink>
              <NavLink
                to="/account?pro=address"
                className={`flex transform items-center  gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                  pro === "address" ? "bg-gray-200 text-gray-800" : ""
                }`}
              >
                <span className="mx-auto text-sm font-medium">
                  Manage Addresses
                </span>
              </NavLink>
            </div>

            {/* -------------------------------------------------------------------------------------------  */}
            { currentUser.message.user.isAdmin ? null:(
            <div className="space-y-3 ">
              <label className="px-3 flex items-center gap-2  text-sm font-semibold uppercase text-gray-900">
                <FaFolderOpen className="h-5 w-5" aria-hidden="true" />
                my stuff
              </label>
              <NavLink
                to="/account?pro=wishlist"
                className={`flex transform items-center  px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                  pro === "wishlist" ? "bg-gray-200 text-gray-800" : ""
                }`}
              >
                <span className="mx-8 text-sm font-medium">My Wishlist</span>
              </NavLink>
              <NavLink
                to="/account?pro=myTable"
                className={`flex transform items-center  px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                  pro === "myTable" ? "bg-gray-200 text-gray-800" : ""
                }`}
              >
                <span className="mx-8 text-sm font-medium">My Table</span>
              </NavLink>
              <NavLink
                to="/account?pro=reviews"
                className={`flex transform items-center  px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 hover:underline ${
                  pro === "reviews" ? "bg-gray-200 text-gray-800" : ""
                }`}
              >
                <span className="mx-8 text-sm font-medium">My Reviews </span>
              </NavLink>
            </div>
            )}
            {/* -------------------------------------------------------------------------------------------  */}
          </nav>
        </div>
      </div>

      <div className="">
        <button onClick={handleLogout} className="w-full  bg-[#E52A3D] text-white hover:bg-black shadow-lg border z-30 font-semibold py-2 rounded-md mt-4">
          Logout
        </button>
        
      </div>
      <div>
        {error && (
          <div className="text-center text-red-600 p-3 rounded-md">{error}</div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
