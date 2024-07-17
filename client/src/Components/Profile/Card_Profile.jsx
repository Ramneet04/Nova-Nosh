import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFail, updateSuccess, updateStart, clearError,deleteUserSuccess,deleteUserFail,deleteUserStart } from '../../Redux/User-Slice/userSlice';
import { Navigate } from 'react-router-dom';
import { resetCart } from "../../Redux/Cart-slice/cartSlice";
import { signOutSuccess } from "../../Redux/User-Slice/userSlice";
import { resetAddress } from "../../Redux/User-Slice/addressSlice";


import { useNavigate } from "react-router-dom";
function CardProfile() {
  const [formData, setFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState('');

  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const userID = currentUser?.message?.user?._id;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
  
    try {
      
      const refreshRes = await fetch(`/api/auth/refreshToken?userID=${userID}`, {
        method: "GET",
        credentials: "include",
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
  
      // If the refresh token is successfully exchanged for a new access token, proceed with updating the profile
      dispatch(updateStart());
      const res = await fetch(`/api/auth/updateProfile/${currentUser?.message?.user?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
  
      if (!res.ok) {
        dispatch(updateFail(data.error));
        setUpdateMessage(data.error);
      } else {
        dispatch(updateSuccess(data));
        setUpdateMessage(data.status);
      }
  
      setTimeout(() => {
        setUpdateMessage('');
        dispatch(clearError());
      }, 4000);
    } catch (error) {
      dispatch(updateFail(error.message));
      setUpdateMessage(error.message);
      setTimeout(() => {
        setUpdateMessage(null);
        dispatch(clearError());
      }, 4000);
    }
  };

  // Function to delete user account -------------------------------------------
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
  
    try {
   
      const refreshToken = currentUser?.message?.refreshToken 
    
      const refreshRes = await fetch(`/api/auth/refreshToken?refresh=${refreshToken}`, {
        method: 'POST',
        credentials: 'include',
      });
   
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

      dispatch(deleteUserStart());
      const res = await fetch(`/api/auth/deleteAccount/${currentUser?.message?.user?._id}`, {
        method: 'DELETE',
      }
    
    );
    const data = await res.json();
    if (!res.ok) {
      dispatch(deleteUserFail(data.error));
      setUpdateMessage(data.error);
    } else {
      dispatch(deleteUserSuccess());
      setUpdateMessage(data.status);
    }

    
    setTimeout(() => {
      setUpdateMessage('');
      dispatch(clearError());
    }, 2000);

    } catch (error) {
      dispatch(updateFail(error.message));
      setUpdateMessage(error.message);
      setTimeout(() => {
        setUpdateMessage(null);
        dispatch(clearError());
      }, 4000);
    }
  }

  return (
    <section className="bg-zinc-50 w-full flex  items-center justify-center min-h-screen">
      <div className="bg-white w-full mx-4 md:mx-0 max-w-2xl shadow-xl md:shadow-lg  rounded-md px-6 md:px-16 py-10 ">
        <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:gap-16 pb-2 md:pb-0 gap-4">
            <div className="col-span-1">
              <label htmlFor="firstName" className="block text-sm my-3 font-semibold text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full text-gray-600 focus:outline-none"
                defaultValue={currentUser?.message?.user?.firstName || ''}
                placeholder="First Name"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="lastName" className="block text-sm my-3 font-semibold text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
                defaultValue={currentUser?.message?.user?.lastName || ''}
                placeholder="Last Name"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2  md:gap-16">
            <div className="col-span-1 pb-2 md:pb-0">
              <label htmlFor="email" className="block text-sm my-3 font-semibold text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field cursor-not-allowed border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
                defaultValue={currentUser?.message?.user?.email || ''}
                placeholder="Email"
                readOnly 
              />
            </div>
            <div className="col-span-1 pb-2 md:pb-0">
              <label htmlFor="password" className="block text-sm my-3 font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full focus:outline-none text-gray-600"
                defaultValue="***************"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm my-3  pb-2 md:pb-0 font-semibold text-gray-700">
              Gender
            </label>
            <input
              id="gender"
              type="text"
              className="input-field border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
              defaultValue={currentUser?.message?.user?.gender || ''}
              placeholder="Gender"
              onChange={handleChange}
            />
          </div>
          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="bg-[#E52A3D] form-box text-white font-semibold py-2 px-4 rounded-md   w-full"
            >
              Update
            </button>
            <button 
            type="submit"
            className="w-full  bg-black text-white form-box shadow-lg  border z-30 font-semibold py-2 px-4  rounded-md "
            onClick={handleDeleteAccount}
            >

          Delete Account
        </button>
          </div>
        </form>
        <div>
          {updateMessage && (
            <div className="text-center text-green-500 p-3 font-bold rounded-md">{updateMessage}</div>
          )}
          {error && (
            <div className="text-center text-red-600 p-3 rounded-md">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CardProfile;
