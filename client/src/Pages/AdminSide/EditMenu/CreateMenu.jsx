import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  updateFail,
  updateSuccess,
  clearError,
} from "../../../Redux/User-Slice/userSlice.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { useNavigate } from "react-router-dom";
import { app } from "../../../Firebase/firebase.js";
import { set } from "mongoose";
function CreateMenu() {
  const [imageData, setImageData] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [error, setError] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMessage, setsuccessMessage] = useState(null);
  const [imageUploadProgres, setImageUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setImageData(imageFile);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    try {
      if (!imageData) {
        setImageUploadError("Please select Menu image");
        setTimeout(() => {
          setImageUploadError(null);
        }, 3000);
        return;
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageData.name;

      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageData);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Could not upload image (image < 2mb)");
          setTimeout(() => {
            setImageUploadError(null);
            setImageUploadProgress(0);
          }, 3000);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUpdateMessage("Image uploaded successfully");
            setFormData({ ...formData, menuImage: downloadURL });
            setImageUploadProgress(0);
            setImageFileURL(downloadURL);
           
            setTimeout(() => {
              setImageUploadError(null);
              setUpdateMessage(null);
            }, 3000);
          });
        }
      );
    } catch (error) {
      setError("Error in uploading image (image_size < 2mb)");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }

    try {
      const refreshRes = await fetch(`/api/auth/refreshToken`, {
        method: "GET",
        credentials: "include",
      });

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
      const dataRefresh = await refreshRes.json();
      dispatch(updateSuccess(dataRefresh)); 
      
      

      // If the refresh token is successfully exchanged for a new access token, proceed with updating the profile

      const res = await fetch(`/api/menu/createMenu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      }

      setsuccessMessage(data.message.message);

      setTimeout(() => {
        setError(null);
        setsuccessMessage(null);
        navigate(`/menu/${data.status.menu.slug}`)
      }, 4000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  return (
    <section className="bg-zinc-50 w-full flex  items-center justify-center min-h-screen">
      <div className="bg-white w-full mx-4 md:mx-0 max-w-2xl shadow-xl md:shadow-lg  rounded-md px-6 md:px-16 py-10 ">
        <h1 className="text-3xl font-bold text-center mb-6">Create Menu</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:gap-16 pb-2 md:pb-0 gap-4">
            <div className="col-span-1">
              <label
                htmlFor="menuName"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Menu Name
              </label>
              <input
                id="menuName"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full text-gray-600 focus:outline-none"
                // defaultValue={currentUser?.message?.user?.firstName || ''}
                placeholder="Menu Name"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="menuPrice"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Menu Price
              </label>
              <input
                id="menuPrice"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full text-gray-600 focus:outline-none"
                placeholder="Menu Price"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2  md:gap-16">
            <div className="col-span-1 pb-2 md:pb-0">
              <label
                htmlFor="menuCategory"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Menu Category
              </label>
              <input
                id="menuCategory"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
                // defaultValue={currentUser?.message?.user?.email || ''}
                placeholder="Menu Category"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 pb-2 md:pb-0">
              <label
                htmlFor="menuType"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Menu Type
              </label>
              <select
                id="menuType"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full focus:outline-none text-gray-600"
                onChange={handleChange}
              >
                <option value="">Select Menu Type</option>
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
              </select>
            </div>
          </div>

          <div className="col-span-1 pb-2 md:pb-0">
            <label
              htmlFor="menuType"
              className="block text-sm my-3 font-semibold text-gray-700"
            >
              Menu Image
            </label>
            <div className="flex flex-col md:flex-row md:gap-8">
              <div className="flex md:gap-8">
                <div>
                  <input
                    id="menuImage"
                    type="file"
                    accept="image/*"
                    className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full focus:outline-none text-gray-600"
                    placeholder="Menu Ingredients"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="mx-4 px-6 border rounded bg-black text-gray-200 flex items-center">
                  <button
                    type="submit"
                    className=""
                    onClick={handleImageUpload}
                  >
                    {imageUploadProgres ? (
                      <div className="w-14 h-14 text-center">
                        <CircularProgressbar
                          value={imageUploadProgres}
                          text={`${imageUploadProgres || 0} % `}
                          styles={buildStyles({
                            pathColor: "#00ff00",
                            textColor: "#00ff00",
                            trailColor: "#E52A3D",
                            rotation: 0.25,
                          })}
                        />
                      </div>
                    ) : (
                      " Upload Image"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {imageUploadError && (
              <div className="text-center text-red-600 p-3 rounded-md">
                {imageUploadError}
              </div>
            )}

            {updateMessage && (
              <div className="text-center text-green-500 p-3 font-bold rounded-md">
                {updateMessage}
              </div>
            )}
          </div>

          <div className="md:grid md:grid-cols-2  md:gap-16">
            <div className="col-span-1 pb-2 md:pb-0">
              <label
                htmlFor="menuCategory"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Menu Discount
              </label>
              <input
                id="menuDiscount"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
                // defaultValue={currentUser?.message?.user?.email || ''}
                placeholder="Menu Discount"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 pb-2 md:pb-0">
              <label
                htmlFor="menuType"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Menu Description
              </label>
              <input
                id="menuDescription"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full focus:outline-none text-gray-600"
                placeholder="Menu Description"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-span-1 pb-2 md:pb-0">
              <label
                htmlFor="menuType"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Menu Status
              </label>
              <select
                id="menuStatus"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full focus:outline-none text-gray-600"
                onChange={handleChange}
               
              >
                <option value="">Select Menu Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="bg-[#E52A3D] form-box text-white font-semibold py-2 px-4 rounded-md   w-full"
            >
              Create Menu
            </button>
          </div>
        </form>
        <div>
          {successMessage && (
            <div className="text-center text-green-500 p-3 font-bold rounded-md">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CreateMenu;
