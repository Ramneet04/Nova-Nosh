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
import { CiUser } from "react-icons/ci";
import { set } from "mongoose";

function Members() {
  const { currentUser } = useSelector((state) => state.user);
  const [userList, setUserList] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [menuIdDelete, setMenuIdDelete] = useState("");
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [userDelete, setUserDelete] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/auth/getUser`);
        const data = await res.json();

        if (res.ok) {
          setUserList(data);
          
        }
      } catch (error) {
        setError(error);
      }
    };

    if (currentUser.message.user.isAdmin) {
      fetchUser();
    }
  }, [currentUser.message.user._id, currentUser.message.user.isAdmin]);

  const handleDeletePost = async () => {
    setShowModel(false);
  };
  const handleConfirmDelete = async (userIdDelete) => {
    setShowModel(false);

    try {
      const res = await fetch(
        `/api/auth/deleteUser/${userIdDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        setError(data.error);
        setTimeout(() => {
          setError(null);
        }, 4000);
        
      } else {
        setUpdateMessage(data.message);
        setTimeout(() => {
          setUpdateMessage(null);
        }, 4000);
        const newData = userList.data.filter((user) => user._id !== userIdDelete);
        setUserList({ ...userList, data: newData });
      }

    } catch (error) {
      setError(error.message);
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
      {currentUser.message.user.isAdmin && userList?.data?.length > 0 ? (
        <section className="mx-auto w-full bg-zinc-50 max-w-7xl px-4 py-4 ">
        <div className=" flex flex-col bg-gray-100  rounded-lg shadow-lg z-10">
          <div className="-mx-4 -my-2  overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-400  md:rounded-lg ">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-zinc-200 ">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-md font-heading_font  dark:text-gray-200 text-gray-700"
                        >
                          <span>Members</span>
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-left  text-md font-heading_font  dark:text-gray-200 text-gray-700"
                        >
                          CreatedAt
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-md font-heading_font   dark:text-gray-200 text-gray-700"
                        >
                          Admin
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-md font-heading_font   dark:text-gray-200 text-gray-700"
                        >
                          Is Verified
                        </th>

                        <th scope="col" className="relative px-4 py-3.5">
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#131315] dark:glass-container   bg-gray-100 dark:bg-[#131315] ">
                      {userList?.data?.map((users) => (
                        <tr key={users._id}>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-14 w-14 flex-shrink-0">
                                {users.image ? (
                                  <img
                                    className="h-14 w-14 rounded-md object-cover"
                                    src={users.image}
                                    alt=""
                                  />
                                ) : (
                                  <CiUser className="h-14 w-14 rounded-md object-cover" />
                                )}
                              </div>
                              <div className="ml-6">
                                <div className="text-sm font-sub_heading   text-gray-900 dark:text-gray-100">
                                  {users.firstName} {" "} {users.lastName}
                                </div>

                                <div className="text-sm text-gray-700">
                                  {users.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-12 py-4">
                            <div className="text-sm font-sub_heading   text-gray-900 dark:text-gray-100 ">
                              {new Date(users.createdAt).toLocaleDateString()}
                            </div>

                           
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 cursor-pointer font-sub_heading text-sm text-gray-700 dark:text-gray-100">
                            <span
                            
                              className={users.isAdmin ? "text-green-500" : ""}
                            >
                              {users.isAdmin ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 cursor-pointer font-sub_heading text-sm text-gray-700 dark:text-gray-100">
                            <span
                              
                              className={users.isAdmin ? "text-green-500" : ""}
                            >
                              {users.isVerified ? "Yes" : "No"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 font-sub_heading   text-right text-sm font-medium">
                            <span
                              onClick={() => {
                                setShowModel(true);
                               setUserDelete(users._id);
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
                            <div className="p-6">
                              <p className="text-lg font-body_font mb-4 text-[#27374D] dark:text-[#DDE6ED]">
                                Are you sure that you want to delete Alumni
                                Profile ??
                              </p>
                              <div className="flex justify-end">
                                <Button
                                  onClick={handleCancel}
                                  className="text-gray-200 dark:bg-gray-700 dark:text-gray-200 border bg-[#27374D] border-none border-[#27374D] dark:border-[#DDE6ED] hover:bg-black hover:text-white mr-2"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleConfirmDelete(userDelete)
                                  }
                                  className="bg-red-500 dark:bg-red-700 dark:text-gray-200 hover:bg-red-600"
                                >
                                  Confirm
                                </Button>
                              </div>
                            </div>
                          </Modal>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                   {error && (
                    <div className="text-red-500 border border-red-500 text-center bg-red-100 p-2 rounded-md">
                      {error}
                    </div>
                  )}
                  {updateMessage && (
                    <div className="text-green-500 border border-green-500 bg-green-100 p-2 text-center rounded-md">
                      {updateMessage}
                    </div>
                  )} 
                  
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-center m-auto h-screen">
          <p className="text-gray-500 text-lg">
            <span className="font-bold">Oops!</span> You don't have any users Login
          </p>
        </div>
      )}
    </>
   
  );
}

export default Members;
