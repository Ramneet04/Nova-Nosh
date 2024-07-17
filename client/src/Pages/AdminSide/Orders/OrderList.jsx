import { set } from "mongoose";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import {
  updateFail,
  updateSuccess,
  clearError,
} from "../../../Redux/User-Slice/userSlice.js";
function OrderList() {
  const { currentUser } = useSelector((state) => state.user);
  const [fullMenuList, setFullMenuList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [menuIdDelete, setMenuIdDelete] = useState("");
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `/api/order/allOrder/${currentUser?.message?.user?._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setOrderList(data);
          if (orderList?.data?.totalOrder < 7) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setError("Error in fetching order : " + error);
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
    };

    if (currentUser.message.user.isAdmin) {
      fetchOrder();
    }
  }, [currentUser.message.user._id, currentUser.message.user.isAdmin]);

  const handleOrderStatusChange = (orderId) => async (e) => {
    const orderStatus = e.target.value;
    try {
      const res = await fetch(`/api/order/updateOrder/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Error in updating order status : " + data.message);
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
      setUpdateMessage(data.message);
      setTimeout(() => {
        setUpdateMessage(null);
      }, 4000);

    } catch (error) {
      setError("Error in updating order status : " + error);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

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

    
    const handleDeletePost = async () => {
      setShowModel(false);
    };

    const handleConfirmDelete =(orderId) => async (e) => {
      setShowModel(false);

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

        const res = await fetch(
          `api/order/deleteOrder/${orderId}`,
          {
            method: "DELETE",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          
          setError("Error in deleting menu" )
          setTimeout(() => {
            setError(null);
          }, 4000);
        } else {
          setUpdateMessage(data.message);
          setTimeout(() => {
            setUpdateMessage(null);
          }, 4000);
        }
      } catch (error) {
        setError("Error in deleting menu : " + error);
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
    };
    const handleCancel = async () => {
      setShowModel(false);
    };

  return (
    <>
      {currentUser.message.user.isAdmin && orderList?.data?.totalOrder > 0 ? (
        <section className="mx-auto w-full bg-zinc-50 max-w-7xl px-4 py-4 ">
          <div className=" flex flex-col bg-zinc-100  rounded-lg shadow-lg z-10">
            <div className="-mx-4 -my-2  overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-zinc-100  md:rounded-lg ">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-zinc-200 ">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-md font-heading_font   text-gray-700"
                        >
                          <span>Order ID</span>
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-left  text-md font-heading_font text-gray-700"
                        >
                          Date
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-md font-heading_font text-gray-700"
                        >
                          Customer
                        </th>

                        <th
                          scope="col"
                          className="md:px-4 px-2 py-3.5 text-left text-md font-heading_font text-gray-700"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="md:px-8 px-12 py-3.5 text-left text-md font-heading_font text-gray-700"
                        >
                          Status Order
                        </th>

                        <th scope="col" className="relative px-4 py-3.5">
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-400 bg-white ">
                      {orderList?.data?.order?.map((order) => (
                        <tr key={order._id}>
                          <Link to={`/dashboard?tab=orderId&orderId=${order._id}&userId=${order.user}`}>
                          <td className="whitespace-nowrap px-4 pt-6">
                            <div className="flex items-center uppercase">
                              #OD{order._id.slice(0, 12)}
                            </div>
                          </td>
                          </Link>
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
                                <div className="text-sm font-normal font-sub_heading text-gray-900">
                                  {formattedDateTime}
                                </div>
                              );
                            })()}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 font-sub_heading text-sm text-gray-700 ">
                            {order.customerName}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 font-sub_heading text-sm text-gray-700 ">
                            ₹ {order.totalMoney}
                          </td>

                          <td className="whitespace-nowrap px-2 md:px-12 py-4">
                            <div className="text-sm font-sub_heading text-gray-900">
                              <select
                                id="orderStatus"
                                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 rounded-md w-full focus:outline-none text-gray-600"
                                onChange={handleOrderStatusChange(order._id)}
                                defaultValue={order.orderStatus || ""}
                              >
                                <option value="">Update Status</option>
                                <option value="Accepted">Accept</option>
                                <option value="Declined">Decline</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Out for Delivery">
                                  Out for Delivery
                                </option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 font-sub_heading   text-right text-sm font-medium">
                            <span
                              onClick={() => {
                                setShowModel(true);
                                setMenuIdDelete(order._id);
                              }}
                              className=" cursor-pointer hover:underline text-red-700"
                            >
                              Delete
                            </span>
                          </td>

                          <Modal
                            show={showModel}
                            onClose={handleCancel}
                            onConfirm={handleDeletePost}
                            popup
                            size="sm"
                          >
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                              {" "}
                              {/* Centering and backdrop */}
                              <div className="p-6 bg-gray-100 shadow-lg flex flex-col justify-center rounded-md">
                                <p className="text-lg font-body_font mb-4 text-[#27374D] ">
                                  Are you sure that you want to delete this
                                  menu?
                                </p>
                                <div className="flex justify-end">
                                  <Button
                                    onClick={handleCancel}
                                    className="text-gray-200 dark:bg-gray-700 dark:text-gray-200 border bg-[#27374D] border-none hover:bg-black hover:text-white mr-2"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleConfirmDelete(order._id)}
                                    className="bg-red-500 dark:bg-red-700 dark:text-gray-200 hover:bg-red-600"
                                  >
                                    Confirm
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Modal>
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
            <span className="font-bold">Oops!</span> You don't have any posts.
          </p>
        </div>
      )}
    </>
    // <div>
    //     <h1>Order List</h1>
    //     </div>
  );
}

export default OrderList;
