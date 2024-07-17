import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import CheckoutImage from "../assets/Images/Checkout.png";
// Icons ->
import { FaPen, FaPlus } from "react-icons/fa";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { BiCheckboxSquare } from "react-icons/bi";

// Redux ->
import {
  removeFromCartSuccess,
  addToCartFail,
  addToCartSuccess,
  removeFromCartFail,
  resetCart,
} from "../Redux/Cart-slice/cartSlice";

import {
  addAddressFail,
  addAddressStart,
  addAddressSuccess,
} from "../Redux/User-Slice/addressSlice";
import {
  updateFail,
  updateSuccess,
  clearError,
} from "../Redux/User-Slice/userSlice";

// Main Function ->
function Checkout() {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const [products, setProducts] = useState([]);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [error, setError] = useState(null);
  const cartProduct = cart?.status?.cartData?.menus?.map((m) => m.menu);
  const [success, setSuccess] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { currentAddress } = useSelector((state) => state.address);

  const location = useLocation();
  const navigate = useNavigate();

  

  // Fetching the address of the user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = currentUser?.message?.user?._id;
        if (currentAddress === null) {
          const refreshRes = await fetch(`/api/auth/refreshToken?userID=${userID}`, {
            method: "GET",
            credentials: "include",
          });

          const dataRefresh = await refreshRes.json();
          if (!refreshRes.ok) {
            dispatch(updateFail(dataRefresh.error));
            setUpdateMessage("Please clear cookies and sign in again");
            setTimeout(() => {
              setUpdateMessage(null);
              dispatch(clearError());
            }, 4000);
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
  }, [currentUser?.message?.user?._id, currentAddress?.status.address[0]]);
  //---------------------------------------------

  
  
  

 
 
  // Calculating total money, discount, delivery charges and final money
  

  const totalMoney =cart?.data?.menus?.reduce((acc, item) => 
    acc + item.menuData.menuPrice * item.quantity
  , 0);
  const totalDiscount = cart?.data?.menus?.reduce((acc, item) =>
    acc + item.menuData.discountPrice * item.quantity
  , 0);
  const discount = totalMoney - totalDiscount ;
  const showDiscount = discount+(totalMoney > 200 ? 50 : 0)
  const finalMoney = totalDiscount + (totalMoney > 200 ? 0 : 50);
  const address = currentAddress?.status?.address;

  const currentUrl = window.location.href
  const match = currentUrl.match(/order_[^\s/]+/);
  const orderId = match ? match[0] : null;
 

  // Payment Gateway -> Razorpay
  const [order, setOrder] = useState(null);
  const handlePayment = async (e) => {
    if(currentAddress === null){
      setError("Please add an address to continue");
      setTimeout(() => {
        setError(null);
      }
      , 4000);
      return;
    }
    if(orderId === null){
      setError("Error while placing order");
      setTimeout(() => {
        setError(null);
      }, 4000);
      return;
    }

    try {
        var options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: discount*100,
          currency: "INR",
          name: "Nova Nosh",
          description: "Test Transaction",
          // "image": "https://example.com/your_logo",
          order_id: orderId,
          handler: async function (response) {
            
            const body = {
              razorpay_payment_id: response.razorpay_payment_id,
              order_id: orderId,
              razorpay_signature: response.razorpay_signature,
              _id : cart?.data?._id,
              userId : currentUser?.message?.user?._id || cart?.data?.userId,
              totalMoney :finalMoney,
            };

            const successMessage = await fetch(`/api/payment/capture`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                body),
            });

            const successData = await successMessage.json();
            if(successData.status === 200){
              dispatch(resetCart())
              navigate('/orderStatus')
            }
          },
          prefill: {
            name: `${currentAddress?.status?.address?.fullName}`,
            email: `${currentUser?.message?.user?.email}`,
            contact: `${currentAddress?.status?.address?.phoneNumber}`,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#E52A3D",
          },
        };

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = function () {
          // Razorpay library is now loaded, you can use Razorpay constructor here
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        };
        document.body.appendChild(script);
        e.preventDefault();
    } catch (error) {
    
      setError("Error while placing order");
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  const isCartEmpty = !cart.data || !cart.data.menus || cart.data.menus.length === 0;
  return (
    <>
      {isCartEmpty?(
        <div className="mx-auto max-w-7xl px-5 bg-zinc-50 lg:px-0">
        <div className="mx-auto max-w-xl md:max-w-2xl py-8 px-6 md:px-2 lg:max-w-3xl">
          <h1 className="text-3xl text-center font-serif tracking-tight text-gray-900 md:text-5xl">
            Checkout
          </h1>
          <div className="flex justify-center items-center mt-12">
            <div className="flex flex-col items-center">
              <div>
                <img
                src={CheckoutImage}
                  alt="empty cart"
                  className="h-52 md:h-72 w-52 md:w-72 object-contain bg-transparent -z-10"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Your cart is empty
                </h2>
              </div>
              <div className="">
                <p className="text-gray-500 flex  md:text-base text-center mt-3 mb-2">
                Let's transform your cart into a feast of flavors!
                </p>
              </div>
              <Link
                to="/menu"
                className="block px-3 py-3 bg-black text-white font-semibold text-sm text-center mt-5 rounded-md shadow-sm hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
       
      ):(
          <section className=" bg-zinc-50 pb-6 md:py-8  body-font">
          <div className="md:py-10 py-6  ">
            <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
              Checkout
            </p>
          </div>
          <div className="mx-auto bg-zinc-50  max-w-4xl ">
            <div className="overflow-hidden  rounded-xl  shadow-xl ">
              <div className="grid grid-cols-1  md:grid-cols-2">


                {/* Address -> If no address than add else show address */}
    
                {currentAddress === null ? (
                  <div className="px-6 py-8 my-auto text-gray-900 md:px-10 ">
                    <div className="flow-roo ">
                      <div className="py-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                          No Saved Address
                        </h2>
    
                        <p className="mt-4 text-sm text-gray-800">
                          You don't have any saved address. Please add an address to
                          continue.
                        </p>
    
                        <Link to="/account?pro=address">
                          <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-[#E52A3D] transition">
                            <FaPlus className="inline-block mr-2" />
                            Add New Address
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-1  py-6 text-gray-900 md:px-8">
                    <div className="flow-root">
                      <div className="-my-6 divide-y divide-gray-200">
                        <div className="py-6">
                          <div className=" text-gray-800  p-6 ">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  Deliver to :
                                </h3>
                              </div>
                              <div>
                                <Link to="/account?pro=address">
                                  <button className=" transition">
                                    <FaPen className="inline-block mr-2" />
                                  </button>
                                </Link>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold mt-2">
                                {address?.fullName}
                              </p>
    
                              <p className="mt-1 flex ">
                                {address?.houseNo}, {address?.area},{" "}
                                {address?.district} - {address?.pin_code},{" "}
                                {address?.state}
                              </p>
                              <p className="mt-1 ">Phone: {address?.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
    
                {/* Product List */}
                <div className="bg-zinc-100 px-5 rounded-t-xl md:rounded-xl md:px-8">
                  <div className="flow-root">
                    <ul className="-my-7 divide-y py-4 divide-gray-200">
                      { cart?.data?.menus?.map((product) => (
                        <li
                          key={product.menuData.id}
                          className="flex items-stretch justify-between space-x-5 py-7"
                        >
                          <div className="flex flex-1 items-stretch">
                            <div className="flex-shrink-0">
                              <img
                                className="h-20 w-20  object-contain"
                                src={product.menuData.menuImage}
                                alt={product.menuData.menuName}
                              />
                            </div>
                            <div className="ml-5 flex flex-col justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-bold">
                                  {product.menuData.menuName}
                                </p>
                                <div className="mt-1 flex text-sm">
                                  <div className="flex items-center">
                                    {product.menuData.menuType === "veg" ? (
                                      <span className="text-sm font-semibold text-green-600 flex items-center">
                                        Pure-Veg
                                        <BiCheckboxSquare className=" mt-1 ml-1 h-6 w-6" />
                                      </span>
                                    ) : (
                                      <span className="text-sm font-semibold text-red-600 flex items-center">
                                        Non-Veg
                                        <BiCheckboxSquare className=" mt-1 ml-1 h-6 w-6" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 flex items-end">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-red-500">
                                    {product.menuData.menuDiscount}% off
                                  </span>
                                  <span className=" font-bold text-base text-green-600">
                                    ₹{product.menuData.discountPrice}
                                  </span>
                                  <span className="text-gray-500 text-base line-through">
                                    ₹{product.menuData.menuPrice}{" "}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-auto flex flex-col items-end justify-between">
                            {product.menuData.menuCategory ? (
                              <p className="ml-4 border-l border-gray-200 pl-4  text-sm text-gray-500">
                                {product.menuData.menuCategory}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <hr className="mt-6 border-gray-200" />
                  <form action="#" className="mt-6">
                    <div className="sm:flex sm:space-x-2.5 md:flex-col md:space-x-0 lg:flex-row lg:space-x-2.5">
                      <div className="flex-grow">
                        <input
                          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                          type="text"
                          placeholder="Enter coupon code"
                        />
                      </div>
                      <div className="mt-4 sm:mt-0 md:mt-4 lg:mt-0">
                        <button
                          type="button"
                          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                          Apply Coupon
                        </button>
                      </div>
                    </div>
                  </form>
                  <ul className="mt-6 space-y-3">
                    <dl className=" space-y-1 px-3 py-4">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-800">
                          Price of {cart?.data?.menus?.totalQuantity} items
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          ₹ {totalMoney}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <dt className="flex items-center text-sm text-gray-800">
                          <span>Discount</span>
                        </dt>
                        <dd className="text-sm font-medium text-green-700">
                          - ₹ {discount}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="flex text-sm text-gray-800">
                          <span>Delivery Charges</span>
                        </dt>
                        <dd className="text-sm font-medium text-green-700">
                          {" "}
                          {totalMoney > 200 ? (
                            <p>
                              {" "}
                              <span className="text-gray-500 text-sm line-through">
                                ₹ 50
                              </span>{" "}
                              FREE Delivery{" "}
                            </p>
                          ) : (
                            "₹50"
                          )}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between border-y border-dashed py-4 ">
                        <dt className="text-base font-medium text-gray-900">
                          Total Amount
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                          ₹ {finalMoney}
                        </dd>
                      </div>
                    </dl>
                  </ul>
    
                  <div
                    className="font-bold md:block bottom-0 w-full 
               hidden"
                  >
                    <div className="flex justify-between p-4 bg-transparent">
                      <div className=" pt-2 font-medium text-green-700">
                        You will save ₹{showDiscount} on this order
                      </div>
                      {currentAddress === null ? (
                        <Link to="/account?pro=address">
                          <button className="rounded-md bg-[#E52A3D] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80">
                            Add Address
                          </button>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePayment}
                          className="rounded-md bg-[#E52A3D] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
                        >
                          Place Order
                        </button>
                      )}
                      
                    </div>
                  </div>
                </div>
              </div>
    
              <div
                className="font-bold fixed bottom-0 w-full 
               md:hidden"
              >
                <div className="flex justify-between p-4 bg-zinc-50 rounded-t-xl shadow-xl">
                  <div className=" flex items-center ">
                    <div className="flex items-center space-x-2">
                      <span className=" font-semibold text-base text-green-600">
                        ₹ {finalMoney}
                      </span>
                      <span className="text-gray-500 text-base font-normal line-through">
                        ₹ {totalMoney}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <button
                      type="button"
                      onClick={handlePayment}
                      className="rounded-md bg-[#E52A3D] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  
  );
}

export default Checkout;
