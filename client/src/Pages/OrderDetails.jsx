import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { set } from "mongoose";
import { Link } from "react-router-dom";
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";

// Icons ->
import { FaPen } from "react-icons/fa";
import { BiCheckboxSquare } from "react-icons/bi";
import { BsBasket2 } from "react-icons/bs";

function OrderDetails() {
  const { currentUser } = useSelector((state) => state.user);
  const orderId = window.location.pathname.split("/").pop();
  const userId = currentUser?.message?.user?._id;
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log("UserID", userId);
        console.log("OrderID", orderId);
        const res = await fetch(
          `/api/order/order/${userId}?orderId=${orderId}`
        );

        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
        console.log(data);
        setOrderDetails(data);
      } catch (error) {
        setError(error);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    };
    fetchOrderDetails();
    console.log("OrderDetails", orderDetails);
  }, [userId, orderId]);

  const updatedAt = new Date(orderDetails?.data?.[0]?.updatedAt);
  const formattedDate = updatedAt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = updatedAt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  useEffect(() => {
    try {
      const fetchOrderStatus = async () => {
        const res = await fetch(`/api/order/orderStatus/${orderId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
        setOrderStatus(data);
      };

      fetchOrderStatus();
    } catch (error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [orderDetails]);

  const details = orderDetails?.data?.[0];
  const orderStatusDetails = orderStatus?.data?.[0];
  console.log("OrderDetails", orderStatusDetails);

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
                <div className="w-64 ">
                  <p
                    className="text-gray-500 flex md:text-base text-center mt-3 mb-2"
                    
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
        <section className=" bg-zinc-50 pb-6 md:py-8  body-font">
          <div className="md:py-10 py-6  ">
            <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
              Order Details
            </p>
          </div>
          <div className="mx-auto bg-zinc-50  max-w-4xl drop-shadow-lg z-10  ">
            <div className="overflow-hidden  rounded-xl  shadow-xl ">
              <div className="grid grid-cols-1  md:grid-cols-2">
                <div className="px-1  py-6 text-gray-900 md:px-8">
                  <div className="flow-root">
                    <div className="-my-6 divide-y divide-gray-200">
                      <div className="py-6">
                        <div className=" text-gray-800  p-6 ">
                          <div className="flex font-normal text-sm md:text-base text-gray-700 mb-4">
                            <span> Order ID</span>
                            <h3 className=" text-center   uppercase ">
                              - OD{details?._id.slice(0, 14)}
                            </h3>
                          </div>

                          <hr className="border-gray-300 " />
                          <div className="flex mt-3 pt-3 justify-between ">
                            <div>
                              <h3 className="text-sm font-normal">
                                Shipping Details :
                              </h3>
                            </div>
                          </div>
                          <div className="text-left pb-3 mb-3">
                            <p className="text-base font-semibold mt-3">
                              {details?.customerName}
                            </p>
                            <p className=" flex mr-8 ">
                              {details?.customerAddress}
                            </p>
                            <p className=" py-1 font-semibold ">
                              Email: {details?.customerEmail}
                            </p>
                          </div>

                          <hr className="border-gray-300 " />
                          <div className="mt-5 py-3">
                            <Timeline>
                              {orderStatusDetails?.statusDetails.length ===
                              0 ? (
                                <Timeline.Item>
                                  <Timeline.Point />
                                  <Timeline.Content>
                                    <div className="flex gap-4">
                                      <div className="text-center pb-3">
                                        <Timeline.Title className="">
                                          Pending
                                        </Timeline.Title>
                                      </div>

                                      <div className="text-center">
                                        <Timeline.Time>
                                          {formattedDateTime}
                                        </Timeline.Time>
                                      </div>
                                    </div>

                                    <Timeline.Body>
                                      {details?.orderStatus === "Pending" ? (
                                        <p className="text-sm ">
                                          Your order is placed and waiting for
                                          confirmation
                                        </p>
                                      ) : null}
                                    </Timeline.Body>
                                  </Timeline.Content>
                                </Timeline.Item>
                              ) : null}
                              {orderStatusDetails?.statusDetails.map(
                                (entry) => (
                                  <Timeline.Item key={entry?._id}>
                                    <Timeline.Point />
                                    <Timeline.Content>
                                      <div className="flex gap-4">
                                        <div className="text-center pb-3">
                                          <Timeline.Title className="">
                                            {entry?.status === "Pending" ? (
                                              <p className="text-base">
                                                Pending
                                              </p>
                                            ) : entry?.status === "Accepted" ? (
                                              <p className="text-base text-sky-700 ">
                                                Order Accepted
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
                                                On the Way
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
                                              second: "2-digit",
                                            })}
                                          </Timeline.Time>
                                        </div>
                                      </div>

                                      <Timeline.Body>
                                        {entry?.status === "Pending" ? (
                                          <p className="text-sm">
                                            Your order is in, eagerly awaiting
                                            confirmation to get the ball
                                            rolling!
                                          </p>
                                        ) : entry?.status === "Accepted" ? (
                                          <p className="text-sm">
                                            Your order has been accepted, and
                                            we're working hard to deliver it to
                                            you as quickly as we can
                                          </p>
                                        ) : entry?.status === "Preparing" ? (
                                          <p className="text-sm">
                                            Your order is currently being
                                            prepared by our chef and will be on
                                            its way to you shortly.
                                          </p>
                                        ) : entry?.status === "Declined" ? (
                                          <p className="text-sm">
                                            Sorry, some items in your order are
                                            unavailable, so we had to cancel it.
                                            We're here to help with any other
                                            requests!
                                          </p>
                                        ) : entry?.status ===
                                          "Out for Delivery" ? (
                                          <p className="text-sm">
                                            Great news! Your order is now on its
                                            way to you, racing towards your
                                            doorstep!
                                          </p>
                                        ) : entry?.status === "Delivered" ? (
                                          <p className="text-sm">
                                            Your order has arrived! We hope you
                                            loved it and can't wait to serve you
                                            again
                                          </p>
                                        ) : null}
                                      </Timeline.Body>
                                    </Timeline.Content>
                                  </Timeline.Item>
                                )
                              )}
                            </Timeline>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>

               
                {/* Product List */}
                <div className="bg-gray-50 px-5 rounded-t-xl md:rounded-xl md:px-8">
                  <div className="flow-root">
                    <ul className="-my-7 divide-y py-4 divide-gray-200">
                      {details?.menus?.map((product) => (
                        <li
                          key={product?.menuData?.id}
                          className="flex items-stretch justify-between space-x-5 py-7"
                        >
                          <div className="flex flex-1 items-stretch">
                            <Link to={`/menu/${product?.menuData.slug}`}>
                            <div className="flex-shrink-0">
                              <img
                                className="h-20 w-20  object-contain"
                                src={product?.menuData?.menuImage}
                                alt={product?.menuData?.menuName}
                              />
                            </div>
                            </Link>
                            <Link to={`/menu/${product?.menuData.slug}`}>
                            <div className="ml-5 flex flex-col justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-bold">
                                  {product?.menuData?.menuName}
                                </p>
                                <div className="mt-1 flex text-sm">
                                  <div className="flex items-center">
                                    {product?.menuData?.menuType === "veg" ? (
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
                                    {product?.menuData?.menuDiscount}% off
                                  </span>
                                  <span className=" font-bold text-base text-green-600">
                                    ₹{product?.menuData?.discountPrice}
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
                 
                  <hr className="mt-3 border-gray-300" />

                 
                 
                  <ul className=" space-y-3">
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
                      <hr className="mt-4 border-gray-300 border-doted" />
                      <div className="flex items-center justify-between border-y border-dashed py-4 ">
                        <dt className="text-base font-medium text-gray-900">
                          Total Amount
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                          ₹ {finalMoney}
                        </dd>
                      </div>
                      <hr className="mt-4 border-gray-300" />
                    </dl>
                  </ul>

                  <p className="text-sm text-gray-500 px-3 py-4">
                    *The discount is applied to the total amount
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default OrderDetails;
