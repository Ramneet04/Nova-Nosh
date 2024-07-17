import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";

function VerifyEmail() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const [message, setMessage] = useState(" ");
  const [error, setError] = useState(" ");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(token);
      setError(null);
      const res = await fetch(`/api/auth/verifyEmail?token=${token}`);

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMessage(data.message);

      setTimeout(() => {
        // Redirect to sign-in page
        navigate("/signIn");
      }, 2000);

      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <section className=" min-h-screen bg-zinc-50 px-4 md:px-0 flex items-center justify-center">
      <div className="max-w-md w-full  bg-white shadow-xl z-10 rounded-xl py-7 px-11 overflow-hidden">
        <div className=" w-full ">
          <h1 className="text-3xl font-bold text-center mb-6 pb-4 text-gray-700">
            Delicious delights are just a click away!
          </h1>
        </div>
        <div className="px-6 ">
          <p className="text-base text-center text-gray-600 mb-6">
            Tap <span className="font-semibold text-gray-700">Verify</span>{" "}
            below to indulge in the mouthwatering goodness that awaits. We're
            excited to share our flavorful creations with you!
          </p>
          <p className="text-base text-center text-gray-600 mb-6">
            If you haven't received the email, please check your spam folder.
          </p>
        </div>
        <div className=" px-6 py-4 flex justify-center">
          <button
            onClick={verifyEmail}
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
export default VerifyEmail;
