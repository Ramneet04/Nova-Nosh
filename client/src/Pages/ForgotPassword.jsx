import React from "react";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(' ');
    const navigate = useNavigate();

  const handleChanges = (e) => {
    setEmail({ ...email, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });

      if (!res.ok) {
        const errorData = await res.json();
        
        setError(errorData.message);
        return;
      }

     
      const data = await res.json();
      
      setMessage(data.message);
      setLoading(false);
      setTimeout(() => { 
        setMessage(' ');
        }, 4000);

        setTimeout(() => {
            // Redirect to sign-in page
            navigate('/signIn');
            }, 6000);


    } catch (error) {
      setError(error.toString());
    }
  };
  return (
    <section className="flex flex-wrap justify-center bg-gray-50 items-center h-screen">
      <div className=" border mx-4  rounded-xl  lg:w-1/3 shadow-xl bg-white">
        <div className="flex flex-col p-4  lg:p-16">
          <div className="text-center  mx-auto mb-4">
            <FaLock className="text-3xl  text-[#E52A3D]" />
          </div>

          <div className="text-center mb-2">
            <h1 className="text-2xl font-logo_font font-semibold text-gray-800">
              Forgot Password
            </h1>
          </div>
          <div className="text-center mb-4">
            <p className="text-gray-500 p-2">
              Enter your email address and we will send you a link to reset your
              password.
            </p>
          </div>
          <div className="flex flex-col">
            <form className="mt-2" onSubmit={handleSubmit}>
              <input
                className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="email"
                id="email"
                onChange={handleChanges}
                placeholder="Email"
              />

               

              <div className="mt-4">

                <button
                  type="submit"
                  className="w-full h-10 bg-[#E52A3D] text-white rounded-md text-sm font-semibold"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

<div className="text-center mt-4">
{error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                    )}
                    {message && (
                    <div className="text-green-500 text-sm mt-2">{message}</div>
                    )}
</div>
          <div className="text-center my-6 relative">
            <div className="flex items-center">
              <div className="w-full border-t border-gray-300"></div>
              <p className="mx-3 text-gray-500">OR</p>
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <div>
            <p className="text-center">
              <Link to="/signUp" className="text-[#E52A3D] font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <button className="h-10 w-full">
          <Link
            to="/signIn"
            className="text-black bg-red-50 w-full h-full text-sm font-semibold flex items-center justify-center"
          >
            Back to Login
          </Link>
        </button>
      </div>
    </section>
  );
}

export default ForgotPassword;
