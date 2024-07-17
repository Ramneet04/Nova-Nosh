import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFail,
  updateSuccess,
  clearError,
} from "../../Redux/User-Slice/userSlice";
import {
  addAddressFail,
  addAddressStart,
  addAddressSuccess,
} from "../../Redux/User-Slice/addressSlice";
import { resetCart } from "../../Redux/Cart-slice/cartSlice";
import { signOutSuccess } from "../../Redux/User-Slice/userSlice";
import { resetAddress } from "../../Redux/User-Slice/addressSlice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { set } from "mongoose";
function Address_Profile() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  //eg: http://localhost:3000/profile?pro=address
  //then myParam will be address and urlParams will be
  const myParam = urlParams.get("pro");
  //

  const [pincode, setPinCode] = useState("");
  const [load, setLoading] = useState(false);

  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const { currentAddress, error, loading } = useSelector(
    (state) => state.address
  );
  const dispatch = useDispatch();
  const [updateMessage, setUpdateMessage] = useState("");
  const userID = currentUser?.message?.user?._id;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (myParam && myParam === "address") {
          const refreshRes = await fetch(
            `/api/auth/refreshToken?userID=${userID}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const dataRefresh = await refreshRes.json();
          if (!refreshRes.ok) {
            dispatch(updateFail(dataRefresh.error));
            setUpdateMessage("Please clear cookies and sign in again");
            setTimeout(() => {
              setUpdateMessage(null);
              dispatch(clearError());
            }, 4000);
            dispatch(signOutSuccess()),
              dispatch(resetAddress()),
              dispatch(resetCart()),
              navigate("/signIn");
            return;
          }

          dispatch(updateSuccess(dataRefresh));
          const userId = currentUser?.message?.user?._id;
          dispatch(addAddressStart());
          const res = await fetch(`/api/add/getAddress?userId=${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          if (res.ok) {
            dispatch(addAddressSuccess(data));
          } else {
            dispatch(addAddressFail(data.message));
          }
        }
      } catch (error) {
        dispatch(addAddressFail(error.message));
        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
      }
    };

    fetchData();
  }, [location.search, myParam, dispatch]);

  const handlepinCodeChange = (e) => {
    setPinCode(e.target.value);
  };

  const handlePinCode = async (e) => {
    e.preventDefault();
    try {
      dispatch(addAddressStart());

      const refreshRes = await fetch(
        `/api/auth/refreshToken?userID=${userID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const dataRefresh = await refreshRes.json();
      if (!refreshRes.ok) {
        dispatch(updateFail(dataRefresh.error));
        setUpdateMessage("Please clear cookies and sign in again");
        setTimeout(() => {
          setUpdateMessage(null);
          dispatch(clearError());
        }, 4000);
        dispatch(signOutSuccess()),
          dispatch(resetAddress()),
          dispatch(resetCart()),
          navigate("/signIn");
        return;
      }

      dispatch(updateSuccess(dataRefresh));
      setLoading(true);
      const pin_Code = await fetch(`/api/add/pinCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin_code: pincode }),
      });

      const data = await pin_Code.json();
      if (pin_Code.ok) {
        setLoading(false);
        dispatch(addAddressSuccess(data));
        setUpdateMessage(data.message);
        setTimeout(() => {
          setUpdateMessage(null);
          dispatch(clearError());
        }, 4000);
      } else {
        setLoading(false);
        dispatch(addAddressFail(data.message));
        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
      }
    } catch (error) {
      dispatch(updateFail(error.message));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(addAddressStart());
      const res = await fetch(`/api/add/saveAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(addAddressSuccess(data));
        setUpdateMessage(data.message);
        setTimeout(() => {
          setUpdateMessage(null);
          dispatch(clearError());
        }, 4000);
      } else {
        dispatch(addAddressFail(data.message));
        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
      }
    } catch (error) {
      dispatch(addAddressFail(error.message));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
    }
  };

  return (
    <section className="bg-zinc-50 w-full flex  items-center justify-center min-h-screen">
      <div className="bg-white w-full mx-4 md:mx-0 max-w-2xl shadow-xl md:shadow-lg my-6  rounded-md px-6 md:px-16 py-10 ">
        <h1 className="text-3xl font-bold text-center mb-6">Address</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name  and  Mobile number */}
          <div className="grid grid-cols-2 md:gap-16 pb-2 md:pb-0 gap-4">
            <div className="col-span-1">
              <label
                htmlFor="firstName"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full text-gray-600 focus:outline-none"
                // defaultValue={currentUser?.message?.user?.firstName || ''}
                placeholder="Full Name"
                onChange={handleChange}
                defaultValue={"" || currentAddress?.status?.address?.fullName}
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="lastName"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                id="phoneNumber"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
                defaultValue={currentAddress?.status.address?.phoneNumber || ""}
                placeholder="Phone Number"
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pin Code */}
          <div className="md:grid md:grid-cols-2 md:gap-16">
            <div className="col-span-1 pb-2 md:pb-0 flex">
              <div className="">
                <label
                  htmlFor="pinCode"
                  className="block text-sm my-3 font-semibold text-gray-700"
                >
                  Pin Code <span className="text-red-600">*</span>
                </label>

                <input
                  id="pin_code"
                  type="text"
                  className="input-field text-gray-600 px-4 py-2 w-full border hover:shadow-md hover:rounded-xl rounded-md focus:outline-none"
                  placeholder="Pin Code"
                  onChange={handlepinCodeChange}
                  defaultValue={currentAddress?.status?.address?.pin_code || ""}
                />
              </div>
              <div className="mt-12 mx-4 px-6 hover:text-green-700 font-semibold text-gray-600  cursor-pointer">
                <button type="button" onClick={handlePinCode}>
                  {load ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </div>

          {/* District and state */}
          <div className="grid grid-cols-2 md:gap-16 pb-2 md:pb-0 gap-4">
            <div className="col-span-1">
              <label
                htmlFor="district"
                className="block text-sm my-3 font-semibold text-gray-700"
              >
                District
              </label>
              <input
                id="district"
                type="text"
                className="input-field border hover:shadow-md  cursor-not-allowed hover:rounded-xl px-4 py-2 rounded-md w-full text-gray-600 focus:outline-none"
                defaultValue={currentAddress?.status?.address?.district || ""}
                placeholder="District"
                disabled
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="state"
                className="block text-sm my-3 cursor-not-allowed font-semibold text-gray-700"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl cursor-not-allowed text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
                defaultValue={currentAddress?.status?.address?.state || ""}
                placeholder="State"
                disabled
              />
            </div>
          </div>

          {/* House No and Area */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm my-3  pb-2 md:pb-0 font-semibold text-gray-700"
            >
              House No. <span className="text-red-600">*</span>
            </label>
            <input
              id="houseNo"
              type="text"
              className="input-field border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
              defaultValue={currentAddress?.status?.address?.houseNo || ""}
              placeholder="House No,Building Name,Street Name"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm my-3  pb-2 md:pb-0 font-semibold text-gray-700"
            >
              Area <span className="text-red-600">*</span>
            </label>
            <input
              id="area"
              type="text"
              className="input-field border hover:shadow-md hover:rounded-xl text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
              defaultValue={currentAddress?.status.address?.area || ""}
              placeholder="Area,Colony,Locality"
              onChange={handleChange}
            />
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="bg-[#E52A3D] form-box text-white font-semibold py-2 px-4 rounded-md   w-full"
              onClick={handleSubmit}
            >
              Update Address
            </button>
          </div>
        </form>
        <div>
          {updateMessage && (
            <div className="text-center text-green-500 p-3 font-bold rounded-md">
              {updateMessage}
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

export default Address_Profile;
