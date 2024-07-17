import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { set } from "mongoose";
import { Link } from "react-router-dom";
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { FcPaid } from "react-icons/fc";
import { RxCross2 } from "react-icons/rx";

// Icons ->
import { FaPen } from "react-icons/fa";
import { BiCheckboxSquare } from "react-icons/bi";
import { BsBasket2 } from "react-icons/bs";

function OrderID() {
  const { currentUser } = useSelector((state) => state.user);
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);

  const orderID = urlParams.get("orderId");
  const userID = urlParams.get("userId");

  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log("UserID", userID);
        console.log("OrderID", orderID);
        const res = await fetch(
          `/api/order/order/${userID}?orderId=${orderID}`
        );

        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
    
        setOrderDetails(data);
      } catch (error) {
        setError(error);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    };
    fetchOrderDetails();
  }, [userID, orderID]);

  console.log("OrderDetails", orderDetails);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(`/api/order/orderStatus/${orderID}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
        setOrderStatus(data);
      } catch (error) {
        setError(error);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    };
    fetchOrderStatus();
  }, [orderDetails]);

  const details = orderDetails?.data?.[0];
  const orderStatusDetails = orderStatus?.data?.[0];
  console.log("OrderStatus", orderStatusDetails);

  if (error) {
    return <div>{error}</div>;
  }
  const totalMoney = details?.menus?.reduce(
    (acc, item) => acc + item?.menuData?.menuPrice * item.quantity,
    0
  );
  const totalDiscount = details?.menus?.reduce(
    (acc, item) => acc + item?.menuData?.discountPrice * item.quantity,
    0
  );
  const discount = totalMoney - totalDiscount;
  const showDiscount = discount + (totalMoney > 200 ? 50 : 0);
  const finalMoney = totalDiscount + (totalMoney > 200 ? 0 : 50);

  const isOrderEmpty = orderDetails?.data?.length;

  return (
    <>
      {isOrderEmpty === 0 || isOrderEmpty === null ? (
        <div className="mx-auto max-w-7xl px-5 bg-zinc-50 lg:px-0">
          <div className="mx-auto max-w-xl md:max-w-2xl py-8 px-6 md:px-2 lg:max-w-3xl">
            <h1 className="text-3xl text-center font-serif tracking-tight text-gray-900 md:text-5xl">
              Order Details
            </h1>
            <div className="flex justify-center items-center mt-12">
              <div className="flex flex-col items-center">
                <div>
                  <h2 className="text-xl font-semibold font-sans text-gray-900">
                    I think you missed something!
                  </h2>
                </div>
                <div className="w-64 md:w-0">
                  <p
                    className="text-gray-500 flex md:text-base text-center mt-3 mb-2"
                    style={{ wordWrap: "break-word", maxWidth: "100%" }}
                  >
                    Your order details are not available. Please check your
                    order
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
      ) : (
        <section className=" bg-zinc-50 w-full pb-6 md:py-8 mx-auto  body-font">
          <div className="md:py-4 py-4  ">
            <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
              Order Details
            </p>
          </div>
          <div className="flex font-normal mx-auto justify-center text-sm md:text-base pb-4 text-gray-700 ">
            <span> Order ID</span>
            <h3 className=" text-center   uppercase ">
              - OD{details?._id.slice(0, 14)}
            </h3>
            </div>
            <div className="flex items-center justify-center gap-2">
            {details?.isPaid ? (
                <div className="flex items-center justify-center gap-2">
                <p className="text-green-600">Paid</p>
                <FcPaid className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <p className="text-red-600">Not Paid</p>
                <RxCross2 className="h-5 w-5 text-red-600" />
              </div>
            )}
          </div>

          <div className="mx-auto bg-zinc-50  max-w-4xl   ">
            <div className="overflow-hidden   ">
              <div className="flex flex-col  lg:flex-row">
                <div className="px-1 flex-grow lg:w-3/5  py-6 text-gray-900 md:px-1">
                  <div className="flow-root">
                    <div className="-my-6 divide-y divide-gray-200">
                      <div className="py-6">
                        <div className=" text-gray-800  p-2 ">
                          {/* Order Status */}
                          <div className=" py-3 pt-6 px-2 shadow rounded-2xl bg-white">
                            <Timeline horizontal>
                              {orderStatusDetails?.statusDetails.map(
                                (entry) => (
                                  <Timeline.Item key={entry?._id}>
                                    <Timeline.Point />
                                    <Timeline.Content>
                                      <div className="flex flex-col gap-2">
                                        <div className="text-center ">
                                          <Timeline.Title className="">
                                            {entry?.status === "Pending" ? (
                                              <p className="text-base">
                                                Pending
                                              </p>
                                            ) : entry?.status === "Accepted" ? (
                                              <p className="text-base text-sky-700 ">
                                                Accepted
                                              </p>
                                            ) : entry?.status ===
                                              "Preparing" ? (
                                              <p className="text-amber-400 text-base">
                                                Preparing
                                              </p>
                                            ) : entry?.status === "Declined" ? (
                                              <p className="text-base text-red-600">
                                                Cancelled
                                              </p>
                                            ) : entry?.status ===
                                              "Out for Delivery" ? (
                                              <p className="text-amber-500 text-base">
                                                Out
                                              </p>
                                            ) : entry?.status ===
                                              "Delivered" ? (
                                              <p className="text-base text-green-600">
                                                Delivered
                                              </p>
                                            ) : null}
                                          </Timeline.Title>
                                        </div>

                                        <div className="text-center">
                                          <Timeline.Time>
                                            {new Date(
                                              entry.updated_at
                                            ).toLocaleString(undefined, {
                                              month: "long",
                                              day: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </Timeline.Time>
                                        </div>
                                      </div>
                                    </Timeline.Content>
                                  </Timeline.Item>
                                )
                              )}
                            </Timeline>
                          </div>

                          {/* Products details */}
                          <div className="flow-root shadow rounded-2xl px-6 bg-white mt-4">
                            <ul className="-my-7 divide-y py-4 divide-gray-200">
                              {details?.menus?.map((product) => (
                                <li
                                  key={product?.menuData?.id}
                                  className="flex items-stretch justify-between space-x-5 py-7"
                                >
                                  <div className="flex flex-1 items-stretch">
                                    <Link
                                      to={`/menu/${product?.menuData.slug}`}
                                    >
                                      <div className="flex-shrink-0">
                                        <img
                                          className="h-20 w-20  object-contain"
                                          src={product?.menuData?.menuImage}
                                          alt={product?.menuData?.menuName}
                                        />
                                      </div>
                                    </Link>
                                    <Link
                                      to={`/menu/${product?.menuData.slug}`}
                                    >
                                      <div className="ml-5 flex flex-col justify-between">
                                        <div className="flex-1">
                                          <div className="flex gap-4">
                                            <p className="text-sm font-bold">
                                              {product?.menuData?.menuName}
                                            </p>
                                            <p className=" text-gray-900 pt-1 text-xs">
                                              Qty- {product?.quantity}
                                            </p>
                                          </div>
                                          <div className="mt-1 flex text-sm">
                                            <div className="flex items-center">
                                              {product?.menuData?.menuType ===
                                              "veg" ? (
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
                                              {product?.menuData?.menuDiscount}%
                                              off
                                            </span>
                                            <span className=" font-bold text-base text-green-600">
                                              ₹
                                              {product?.menuData?.discountPrice}
                                            </span>
                                            <span className="text-gray-500 text-base line-through">
                                              ₹{product?.menuData?.menuPrice}{" "}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                  <div className="ml-auto flex flex-col items-end justify-between">
                                    {product.menuData.menuCategory ? (
                                      <p className="ml-4 border-l border-gray-200 pl-4  text-sm text-gray-500">
                                        {product?.menuData?.menuCategory}
                                      </p>
                                    ) : null}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 px-4 flex-grow lg:w-2/5 lg:mt-5 rounded-2xl md:rounded-xl md:px-4">
                  <div className="bg-white mt-3 rounded-xl shadow  ">
                    {/* Customer Address */}
                    <div className="flex mt-3 pt-6 px-6 justify-between ">
                      <div>
                        <h3 className="text-sm font-normal">
                          Shipping Details :
                        </h3>
                      </div>
                    </div>
                    <div className="text-left px-6 pb-3 mb-3">
                      <p className="text-base font-semibold mt-3">
                        {details?.customerName}
                      </p>
                      <p className=" flex mr-8 ">{details?.customerAddress}</p>
                      <p className=" py-1 font-semibold ">
                        Email: {details?.customerEmail}
                      </p>
                    </div>
                    <hr className="mt-3 border-gray-300 px-6" />

                    {/* Payment Details */}
                    <ul className=" space-y-3 px-6">
                      <dl className=" space-y-1 px-1 py-4">
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-800">
                            Price of {details?.totalQuantity} items
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
                    <hr className="mt-4 border-gray-300" />
                    <p className="text-sm text-center text-gray-500 px- py-4">
                      *The discount is applied to the total amount
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
    // <div>
    //     <h1 className="">Order ID</h1>
    // </div>
  );
}

export default OrderID;
