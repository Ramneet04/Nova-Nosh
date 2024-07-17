import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";


function ResetPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const [message, setMessage] = useState(" ");
  const [error, setError] = useState(" ");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(token);
      setError(null);
      const res = await fetch(`/api/auth/resetPassword?token=${token}`);

      if (!res.ok) {
        const errorData = await res.json();

        setError(errorData.message);
        setLoading(false);
        return;
      }

     
      
      const data = await res.json();

      console.log(data);
      console.log(data.message.loggedUser)
      
      
      setMessage(data.status);

      setTimeout(() => {
        // Redirect to sign-in page
        navigate(`/updatePassword?token=${token}&email=${data.message.loggedUser.email}`);
      }, 2000);

      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className=" min-h-screen bg-zinc-50 px-4 md:px-0 flex items-center justify-center">
      <div className="max-w-md w-full  bg-white shadow-xl z-10 rounded-xl py-7 px-11 overflow-hidden">
        <div className=" w-full ">
          <h1 className="text-3xl font-bold text-center mb-6 pb-4 text-gray-700">
          Your Food Adventure Awaits. Recover Your Login!
          </h1>
        </div>
        <div className="px-6 ">
          <p className="text-base text-center text-gray-600 mb-6">
         
            We understand, cravings can't wait! So don't let a forgotten password stop you from satisfying your taste buds.
           
           
          </p>
          <p className="text-base text-center text-gray-600 mb-6">
            If you haven't received the email, please check your spam folder.
          </p>
        </div>
        <div className=" px-6 py-4 flex justify-center">
          <button
            onClick={resetPassword}
            className="inline-flex w-full items-center justify-center rounded-md bg-[#E52A3D] px-4 py-2.5 font-semibold leading-7 text-white hover:opacity-90 transition duration-300"
            disabled={loading}
          >
            Verify
          </button>
        </div>
        <div className=" pb-8">
          {message && (
            <div className="text-green-500 text-center mt-4">{message}</div>
          )}
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
}
export default ResetPassword;
