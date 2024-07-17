import React, { useState } from "react";
import { useSelector } from "react-redux";

import ContactImage from "../assets/Images/Contact.png";
import { set } from "mongoose";
function Contact() {
  const [contactInfo, setContactInfo] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const {currentUser} = useSelector((state) => state.user);
  const handleChanges = (e) => {
    setContactInfo({
      ...contactInfo,
      name: currentUser?.message?.user?.firstName + " " + currentUser?.message?.user?.lastName,
      email: currentUser?.message?.user?.email,
      [e.target.id]: e.target.value,
    });
  };
const [loading , setLoading] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    setLoading(true);
  try {
    const response = await fetch('/api/contact/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactInfo),
    });

    setLoading(false);
    const data = await response.json();
    if (response.status === 200) {
      setSuccess(data.message);
      setError(null);
      setTimeout(() => {
        setSuccess(null);
      }
      , 3000);

    } else {
      setError('Failed to send message');
      setSuccess(null);
      setTimeout(() => {  
        setError(null);
      }
      , 3000);

    }
    
  } catch (error) {
    setError(error.message)
    setSuccess(null);
    setTimeout(() => {
      setError(null);
    }
    , 3000);

  }
  };
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-7xl py-12 md:py-24">
          <div className="flex flex-col gap-5  lg:mb-8 lg:pb-6">
            <p className="text-center font-serif  text-3xl text-gray-900  md:text-5xl md:leading-10">
              Get In Touch
            </p>
            <p className="max-w-4xl mx-auto text-center text-base font-body_font   text-gray-600 md:text-xl">
              Your satisfaction is our priority. If you have any inquiries,
              issues, or need support, don't hesitate to contact us we're
              committed to providing the help you need
            </p>
          </div>
        
            {/* contact from */}
            <div className="flex  items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-grow lg:w-1/2 items-center justify-center min-h-screen bg-gray-50">
              <div className="w-full max-w-lg p-6 md:px-6 ">
                <form onSubmit={handleContact} className="space-y-6">
                  <div className="grid w-full gap-6 md:gap-8 lg:grid-cols-2">
                    <div className="w-full space-y-2">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className="block w-full h-10 px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 cursor-not-allowed
                        "
                        type="text"
                        id="name"
                        placeholder={currentUser?.message?.user?.firstName + " " + currentUser?.message?.user?.lastName}
                        disabled
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="block w-full h-10 px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 cursor-not-allowed"
                        type="email"
                        id="email"
                        placeholder= {currentUser?.message?.user?.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="phone_number"
                    >
                      Phone number
                    </label>
                    <input
                      className="block w-full h-10 px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                      type="tel"
                      id="phoneNumber"
                      placeholder="Phone Number"
                      onChange={handleChanges}
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      className="block w-full h-40 px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                      id="message"
                      placeholder="Leave us a message"
                      onChange={handleChanges}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-semibold text-white bg-black rounded-md shadow-sm hover:bg-[#E52A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  
                  </button>
                </form>
              </div>
            </div>

            <div className="flex-grow lg:w-1/2 hidden lg:flex">
            <img
              alt="Contact us"
              className="hidden  rounded-lg object-cover lg:block"
              src={ContactImage}
            />
          </div>
          </div>
          {error && (
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="text-center text-green-500">
              <p>{success}</p>
            </div>
          )}
        </div>
      </div>

      
    </section>
  );
}

export default Contact;
