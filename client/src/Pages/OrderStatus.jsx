import { set } from "mongoose";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { useDispatch } from "react-redux";

function OrderStatus() {
  const { currentUser } = useSelector((state) => state.user);
  const [fullMenuList, setFullMenuList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [menuIdDelete, setMenuIdDelete] = useState("");
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const dispatch = useDispatch();
  const [cartFetched, setCartFetched] = useState(false);

  useEffect(() => {
    if(!cartFetched){
    const fetchOrder = async () => {
      try {
        if (!currentUser.message.user) {
          return;
        }

        const res = await fetch(
          `/api/order/order/${currentUser.message.user._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setOrderList(data);
          if (data?.data?.totalOrder < 7) {
            setShowMore(false);
          }
        } else {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        setError("Error in fetching order: " + error.message);
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
      setCartFetched(true);
    };

    fetchOrder();
  }
}, [currentUser.message.user, setOrderList, setError, orderList]);





    const handleShowMore = async () => {
      const startIndex = orderList?.data?.order?.length;
      try {
        const res = await fetch(`/api/order/allOrder/${currentUser.message.user._id}?startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setOrderList((prev) => [...prev, ...data]);
          if (orderList?.data?.order?.length < 7) setShowMore(false);
        }
      } catch (error) {
        setError(error);
      }
    };

  
  
  return (
    <>
      {orderList?.data?.length > 0 ? (
        <section className="mx-auto w-full bg-zinc-50 max-w-7xl px-4 py-4 ">
          <div className="flex justify-center py-3">
          <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
            Orders 
          </p>
          </div>
          <div className=" flex flex-col bg-zinc-100 md:max-w-5xl mx-auto rounded-lg my-6 shadow-lg z-10">
            <div className="-mx-4 -my-2  overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-zinc-100  md:rounded-lg ">
                  <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-zinc-200 ">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-center text-md font-heading_font   text-gray-700"
                        >
                          <span>Order ID</span>
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-center  text-md font-heading_font text-gray-700"
                        >
                          Date
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-center text-md font-heading_font text-gray-700"
                        >
                          Total Quantity
                        </th>

                        <th
                          scope="col"
                          className="px-4  py-3.5 text-center text-md font-heading_font text-gray-700"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-8  py-3.5 text-center text-md font-heading_font text-gray-700"
                        >
                          Status Order
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-center text-md font-heading_font text-gray-700"
                        >
                          Detail
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-400 bg-white ">
                      {orderList?.data?.map((order) => (
                        
                        <tr key={order._id}>
                          
                          
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className=" text-center" >
                              Order ID - OD{order._id.slice(0, 12)}
                            </div>
                          </td>
                         
                          
                          <td className="whitespace-nowrap px-12 py-4">
                            {(() => {
                              const updatedAt = new Date(order.updatedAt);
                              const formattedDate =
                                updatedAt.toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                              const formattedTime =
                                updatedAt.toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                });
                              const formattedDateTime = `${formattedDate} ${formattedTime}`;

                              return (
                                <div className="text-sm font-normal text-center font-sub_heading text-gray-900">
                                  {formattedDateTime}
                                </div>
                              );
                            })()}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-center font-sub_heading text-sm text-gray-700 ">
                            No of Items : {"  "}
                            {order.totalQuantity}
                          </td>

                          <td className="whitespace-nowrap text-center px-4 py-4 font-sub_heading text-sm text-gray-700 ">
                            ₹ {order.totalMoney}
                          </td>
                         
                          <td className="whitespace-nowrap px-2 md:px-12 py-4">
                            <div className="text-sm flex justify-center  font-sub_heading text-gray-900">

                             {order.orderStatus === "Pending" ? (
                              <span className="px-4 py-1 bg-yellow-50 text-yellow-400 rounded-md">
                                {order.orderStatus}
                              </span>
                            ) : order.orderStatus === "Preparing" ? (
                              <span className="px-4 py-1 bg-blue-50 text-blue-900 rounded-md">
                                {order.orderStatus}
                              </span>
                            ) : order.orderStatus === "Delivered" ? (
                              <span className="px-4 py-1 bg-green-50 text-green-900 rounded-md">
                                {order.orderStatus}
                              </span>
                            ) :order.orderStatus === "Declined" ?(
                             <span className="px-4 py-1 bg-red-50 text-red-900 rounded-md">
                                {order.orderStatus}
                              </span> ): order.orderStatus === "Out for Delivery" ? (
                              <span className="px-4 py-1 bg-orange-50 text-rose-500  rounded-md">
                                {order.orderStatus}
                              </span>
                            ) :
                            (
                              <span className="px-2 py-1 bg-teal-50 text-teal-500   rounded-md">
                                {order.orderStatus}
                              </span>
                            )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                            <Link
                              to={`/orderDetails/${order._id}`}
                              className=" hover:text-blue-900 hover:bg-gray-50 p-2 rounded-md hover:shadow-md text-gray-500"
                            >
                              View Details
                            </Link>
                          </td>
                          

                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {showMore && (
                    <div className="flex justify-center mt-3 mb-3">
                      <button
                        onClick={handleShowMore}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Show More
                      </button>
                    </div>
                  )}
                </div>
{error && (
                <div className="text-center text-red-500 p-3 font-bold rounded-md">
                  {error}
                </div>
              )}
              {updateMessage && (
                <div className="text-center text-green-500 p-3 font-bold rounded-md">
                  {updateMessage}
                </div>
              )
              }
              </div>
              
            </div>
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-center m-auto h-screen">
          {updateMessage && (
            <div className="text-center text-green-500 p-3 font-bold rounded-md">
              {updateMessage}
            </div>
          )}
          <p className="text-gray-500 text-lg">
            <span className="font-bold">Oops!</span> You have not placed any order 
          </p>
        </div>
      )}
    </>
    
  );
}

export default OrderStatus;
