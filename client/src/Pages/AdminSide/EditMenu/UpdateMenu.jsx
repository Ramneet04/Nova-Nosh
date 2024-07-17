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
function UpdateMenu() {
  const { currentUser } = useSelector((state) => state.user);
  const [fullMenuList, setFullMenuList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [menuIdDelete, setMenuIdDelete] = useState("");
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/menu/getmenu`);
        const data = await res.json();

        if (res.ok) {
          setMenuList(data.message.menu.menus);
          setFullMenuList(data.message.menu);
          if (data.message.menu.totalMenu < 7) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setError(error);
      }
    };

    if (currentUser.message.user.isAdmin) {
      fetchMenu();
    }
  }, [currentUser.message.user._id, currentUser.message.user.isAdmin]);

 
  const handleShowMore = async () => {
    const startIndex = menuList.length;
    try {
      const res = await fetch(`/api/post/getMenu?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setMenuList((prev) => [...prev, ...data.message.post.posts]);
        if (data.message.post.posts.length < 7) setShowMore(false);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleDeletePost = async () => {
    setShowModel(false);
  };

  const handleConfirmDelete = async () => {
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
        `/api/menu/deleteMenu/${currentUser.message.user._id}/${menuIdDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
      } else {
        setMenuList((prev) => prev.filter((menu) => menu._id !== menuIdDelete));
      }
    } catch (error) {
      setError("Error in deleting menu : " + error);
    }
  };
  const handleCancel = async () => {
    setShowModel(false);
  };

  return (
    <>
      {currentUser.message.user.isAdmin && fullMenuList.totalMenu > 0 ? (
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
                          className="px-4 py-3.5 text-left text-md font-heading_font   text-gray-700"
                        >
                          <span>Menus</span>
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-left  text-md font-heading_font text-gray-700"
                        >
                          Menu Status
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-md font-heading_font text-gray-700"
                        >
                          Category
                        </th>

                        <th scope="col" className="relative px-4 py-3.5">
                          <span className="sr-only">Delete</span>
                        </th>

                        <th scope="col" className="relative px-4 py-3.5">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#131315] bg-white ">
                      {menuList.map((menu) => (
                        <tr key={menu._id}>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-14 w-14 flex-shrink-0">
                                <Link to={`/menu/${menu.slug}`}>
                                  <img
                                    className="h-14 w-14 rounded-md  object-cover"
                                    src={menu.menuImage}
                                    alt=""
                                  />
                                </Link>
                              </div>
                              <div className="ml-6">
                                <Link to={`/menu/${menu.slug}`}>
                                  <div className="text-sm font-sub_heading   text-gray-900">
                                    {menu.menuName.slice(0, 30)}
                                  </div>
                                </Link>
                                {/* <div className="text-sm text-gray-700">{person.email}</div> */}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-12 py-4">
                            <Link to={`/menu/${menu.slug}`}>
                              <div className="text-sm font-sub_heading   text-gray-900 ">
                                {menu.menuStatus}
                              </div>
                            </Link>
                            {/* <div className="text-sm text-gray-700">{person.department}</div> */}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 font-sub_heading  text-sm text-gray-700 ">
                            {menu.menuCategory}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 font-sub_heading   text-right text-sm font-medium">
                            <span
                              onClick={() => {
                                setShowModel(true);
                                setMenuIdDelete(menu._id);
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
                                    onClick={handleConfirmDelete}
                                    className="bg-red-500 dark:bg-red-700 dark:text-gray-200 hover:bg-red-600"
                                  >
                                    Confirm
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Modal>

                          <td className="whitespace-nowrap px-4 py-4 font-sub_heading   text-right text-sm font-medium">
                            <Link
                              to={`/dashboard?tab=editMenu-${menu._id}`}
                              className="cursor-pointer text-green-700 "
                            >
                              Edit
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
  );
}

export default UpdateMenu;
