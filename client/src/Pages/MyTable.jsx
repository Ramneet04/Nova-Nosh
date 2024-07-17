import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Modal, Button } from "flowbite-react";

import { Link } from "react-router-dom";
import { set } from 'mongoose';
function MyTable() {

  //useState hooks
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [tableList, setTableList] = useState([]);
  const [showModel, setShowModel] = useState(false);
  //useSelector hooks
  const {currentUser} = useSelector((state) => state.user)
  const [tableDelete, setTableDelete] = useState("");
  //fetching table list
  const userId = currentUser.message.user._id;

  useEffect(() => {
    const fetchTableList = async () => {
      try {
        const res = await fetch(`/api/table/tableDetails/${userId}`);
        console.log("I reached")
        const data = await res.json();
      console.log(data)
        if (res.ok) {
          setTableList(data);
        } else {
          setError(data.message);
          setTimeout(() => {
            setError("");
          }, 5000);
        }
      } catch (error) {
        setError("Something went wrong! Please try again later.");
      }
    };
    fetchTableList();
  }, [userId, updateMessage]);

  

  console.log(tableList)
  //handleDelete function
  const handleDeletePost = async () => {
    setShowModel(false);
  };

 


  const handleDelete = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/table/deleteTable/${tableDelete}/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMessage(data.message);
        setTimeout(() => {
          setUpdateMessage("");
        }, 5000);
      } else {
        setError(data.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (error) {
      setError("Something went wrong! Please try again later.");
    }
  };
  const handleCancel = async () => {
    setShowModel(false);
  };

  //after deletion of table
  if (updateMessage && tableList?.data) { 
    const updatedTableList = tableList.data.filter(
      (table) => table._id !== updateMessage.tableId
    );
    setTableList([...updatedTableList]);
  }



  const tableLength = tableList?.data?.length;
  
  return (
    <>
    {tableLength > 0 ? (
      <section className="mx-auto w-full bg-zinc-50 max-w-7xl px-4 py-4 ">
        <div className="flex flex-col space-y-8  py-4 px-2 md:py-8">
              <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
                My Table
              </p>
            </div>
        
        
        <div className=" flex flex-col bg-gray-100  rounded-lg shadow-lg z-10">
          <div className="-mx-4 -my-2  overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-400  md:rounded-lg ">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-zinc-200 ">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-md font-heading_font   text-gray-700"
                      >
                        <span>Table ID</span>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-center  text-md font-heading_font text-gray-700"
                      >
                      Table Status
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text- text-center t-md font-heading_font text-gray-700"
                      >
                        Reserved Date 
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-center text-md font-heading_font text-gray-700"
                      >
                        Reserved By
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-center text-md font-heading_font text-gray-700"
                      >
                        Phone
                      </th>
                      <th scope="col" className="relative px-4 py-3.5">
                        <span className="sr-only">Cancel</span>
                      </th>

                      <th scope="col" className="relative px-4 py-3.5">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-400 bg-white ">
                      {tableList?.data?.map((order) => (
                        
                        <tr key={order._id}>
                          
                          {/* Id */}
                          <td className="whitespace-nowrap px-3 py-4">
                            <div className=" text-center uppercase" >
                               OD{order._id.slice(0, 12)}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="whitespace-nowrap px-2 md:px-4 py-4">
                            <div className="text-sm flex justify-center  font-sub_heading text-gray-900">

                             {order.isReserved === false ? (
                              <span className="px-4 py-1 bg-red-50 text-red-600 rounded-md">
                               Not Reserved
                              </span>
                            ) :(
                              <span className="px-2 py-1 bg-teal-50 text-teal-500   rounded-md">
                                Reserved
                              </span>
                            )}
                            </div>
                          </td>
                          
                          {/* Date and time */}
                          <td className="whitespace-nowrap px-12 py-4">
                            {(() => {
                              const updatedAt = new Date(order.reservedAt);
                              const formattedDate =
                                updatedAt.toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                             
                              const formattedDateTime = `${formattedDate} at ${order.reservedTime}`;

                              return (
                                <div className="text-sm font-normal text-center font-sub_heading text-gray-900">
                                  {formattedDateTime}
                                </div>
                              );
                            })()}
                          </td>

                            {/* Reserved By */}
                          <td className="whitespace-nowrap px-4 py-4 text-center font-sub_heading text-sm text-gray-700 ">
                          
                            {order.reservedBy}
                          </td>

                            {/* Phone Number */}
                          <td className="whitespace-nowrap text-center px-4 py-4 font-sub_heading text-sm text-gray-700 ">
                            {order.phone}
                          </td>
                         
                         {/* Delete */}
                          <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                          <span
                              onClick={() => {
                                setShowModel(true);
                                setTableDelete(order._id);
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
                                    onClick={handleDelete}
                                    className="bg-red-500 dark:bg-red-700 dark:text-gray-200 hover:bg-red-600"
                                  >
                                    Confirm
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Modal>

                          {/* Edit */}
                          <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                            <Link
                              to={`editTable/${order._id}`}
                              className=" hover:text-blue-900 hover:bg-gray-50 p-2 rounded-md hover:shadow-md text-gray-500"
                            >
                              Edit
                            </Link>
                          </td>
                          

                          
                        </tr>
                      ))}
                    </tbody>
                 
                 
                </table>
              
              </div>
             
              {updateMessage && (
            <div className="text-center text-green-500 p-3 font-bold rounded-md">
              {updateMessage}
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 p-3 font-bold rounded-md">
              {error}
            </div>
          )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-4">
                <button className="bg-[#27374D] text-white px-4 py-2 my-5 rounded-md">
                  <Link to="/reservation">Book a Table</Link>
                </button>

              </div>
      </section>
    ) : (
      <div className="flex flex-col items-center justify-center m-auto h-screen">
         {updateMessage && (
            <div className="text-center text-green-500 p-3 font-bold rounded-md">
              {updateMessage}
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 p-3 font-bold rounded-md">
              {error}
            </div>
          )}
        <p className="text-gray-500 text-lg">
          <span className="font-bold">Oops!</span> You have not reserved any table yet.
        </p>
        <button className="bg-[#27374D] text-white px-4 py-2 mt-4 rounded-md hover:bg-[#E52A3D]">
          <Link to="/reservations">Book a Table</Link>
        </button>
      </div>
    )}
  </>
    // <div>
    //   <h1>MyTable</h1>
    // </div>
  )
}

export default MyTable