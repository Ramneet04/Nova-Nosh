import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFail, updateSuccess, clearError } from "../Redux/User-Slice/userSlice.js";
import { Datepicker } from "flowbite-react";
function Reservation() {

  const dispatch = useDispatch();

  // UseState hooks
  const [table, setTable] = useState({});
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);

  // Datepicker hooks
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);

  // UseSelector hooks
  const {currentUser} = useSelector((state) => state.user);

  // Handle changes in the form
  const handleChanges = (e) => {
    const {id, value} = e.target;
    setTable({...table, [id]: value,
    userId: currentUser?.message?.user?._id,
    reservedBy: currentUser?.message?.user?.firstName + " " + currentUser?.message?.user?.lastName,
    email: currentUser?.message?.user?.email

    });
  }    
         
  // Submit the form
  const handleTable = async (e) => {
    e.preventDefault();
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
      
      const res = await fetch(`/api/table/tableBooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          table),
        });
        
        const data = await res.json();
        if (!res.ok) {
          
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 4000);
          return;
        }
       
        setUpdateMessage(data.message);
        setTimeout(() => {
          setUpdateMessage(null);
        }, 4000);
        setTable({});
    } catch (error) {
      setError(error.message)
    setTimeout(() => {
      setError(null);
    })
    } 
  }
 



  return (
    <>
      <section className=" bg-zinc-50 w-full pb-6 md:py-8 mx-auto  body-font">
        <div className="flex flex-col space-y-8 pb-10 pt-12 px-2 md:pt-24">
          <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
            Make a Reservation
          </p>
          <p className="max-w-4xl mx-auto text-center text-base font-body_font   text-gray-600 md:text-xl">
            Reserve your table today and embark on an extraordinary culinary
            journey that promises to delight your senses and create
            unforgettable memories!
          </p>
        </div>
        <div className="mx-auto bg-gray-50 shadow-xl border rounded-xl   max-w-4xl   ">
          <div className="overflow-hidden   ">
          <form onSubmit={handleTable}>
            <div className="flex flex-col gap-2 px-4  lg:flex-row">
              {/* Basic details entry */}
              <div className=" flex-grow lg:w-1/2  text-gray-900  px-4  py-6  md:px-6">
               
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="name">
                        Full Name 
                      </label>
                      <input
                        className="w-full py-2 px-3 border border-gray-100 rounded-lg text-gray-400 cursor-not-allowed  hover:rounded-xl hover:shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400"
                        type="text"
                        id="name"
                        name="name"
                        disabled
                        
                        placeholder= {currentUser?.message?.user?.firstName + " " + currentUser?.message?.user?.lastName}
                        value = {currentUser?.message?.user?.firstName + " " + currentUser?.message?.user?.lastName}
                        onChange={handleChanges}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email 
                      </label>
                      <input
                        className="w-full py-2 px-3 border border-gray-200 rounded-lg hover:rounded-xl hover:shadow-md text-gray-400 cursor-not-allowed focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400"
                        type="email"
                        id="email"
                        name="email"
                        placeholder= {currentUser?.message?.user?.email}
                        value = {currentUser?.message?.user?.email}
                        disabled
                        onChange={handleChanges}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:rounded-xl hover:shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400"
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        onChange={handleChanges}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:rounded-xl hover:shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400 resize-none h-44"
                        id="message"
                        name="message"
                        placeholder="Enter your message...."
                        onChange={handleChanges}
                      ></textarea>
                    </div>
                   
                  </div>
              
              </div>

              {/* Date and Time entry  */}
              <div className="px-1 flex-grow lg:w-1/2  py-6 text-gray-900 md:px-1">
                
                <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="date">
                    Date
                  </label>
                  <Datepicker
                    id="reservedAt"
                    name="reservedAt"
                    className="w-full  border border-gray-300 rounded-lg hover:rounded-xl hover:shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400 bg-white"
                    placeholder="Select Date"
                  
                   minDate={minDate}
                   maxDate={maxDate}
            s
                    onSelect={handleChanges}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="time">
                    Time
                  </label>
                  <input
                    id = "reservedTime"
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:rounded-xl hover:shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400"

                    type="time"
                    onChange={handleChanges}  
                    name="reservedTime"
                    placeholder="Select Time"
                  />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="guests">
                      Number of Guests
                    </label>
                    <input
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:rounded-xl hover:shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400"
                      type="number"
                      id="capacity"
                      name="capacity"
                      placeholder="Enter number of guests"
                      onChange = {handleChanges}
                    />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="events">
                      Event
                    </label>
                    <input
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:rounded-xl hover:shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400"
                      type="text"
                      id="event"
                      name="event"
                      placeholder="Event Name"
                      onChange = {handleChanges}
                    />
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex justify-center py-5">
  <button
    className=" py-2 px-4 bg-gray-900 text-white rounded-xl hover:bg-[#E52A3D] focus:outline-none"
    type="submit"
  >
    Book Table
  </button>



</div>

            </form>

            <div className="p-4 mt-6">
  {error && (
    <p className="text-red-600 text-center font-medium">{error}</p>
  )
  }
  {updateMessage && (
    <p className="text-green-600 text-center font-medium">{updateMessage}</p>
  )
  }
  </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Reservation;
