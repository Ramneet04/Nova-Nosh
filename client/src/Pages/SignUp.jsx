import React from "react";
import Delivery from "../assets/Images/DI.png";
import { Link } from "react-router-dom";
import O_auth from "../Components/O-auth/O_auth.jsx";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
   
    const navigate = useNavigate();

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError(null);
      const res = await fetch('/api/auth/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message);
        setLoading(false);
        return;
      }
  
      const data = await res.json();
      setMessage(data.message);
      
  
      // Hide success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 4000);
  
      // Navigate to sign-in page after 4 seconds
      setTimeout(() => {
        // Redirect to sign-in page
        navigate('/signIn');
      }, 6000);
      setLoading(false);
  
    } catch (error) {
      setError(error);
    }
  }
  
  const [showPassword , setShowPassword] = useState(false)
 
  const handleShowPassword = () =>{
    setShowPassword(!showPassword)
  }


  return (
    <section className="  lg:p-16 p-2 py-16 md:py-12  bg-zinc-50 ">
      <div className="   grid grid-cols-1 px-8 lg:grid-cols-2 rounded-lg ">
        <div className="relative hidden lg:block md:flex md:justify-center">
          <div className="absolute inset-0 mb-28 flex items-center justify-center">
            <img
              className="w-full h-full rounded-md object-cover object-top"
              src={Delivery}
              alt=""
            ></img>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-center text-black sm:text-4xl">
              Sign Up
            </h2>
            <p className="mt-2 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
              <div className="grid grid-cols-2 md:gap-16 pb-2 md:pb-0 gap-4">
            <div className="col-span-1">
              <label htmlFor="firstName" className="block text-sm my-3 font-semibold text-gray-900  ">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl px-4 py-2 bg-transparent rounded-md w-full text-gray-600 focus:outline-none "
                placeholder="First Name"
                onChange={handleChanges}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="lastName" className="block text-sm my-3    font-semibold text-gray-900">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="input-field border hover:shadow-md hover:rounded-xl bg-transparent text-gray-600 px-4 py-2 rounded-md w-full focus:outline-none"
              
                placeholder="Last Name"
                onChange={handleChanges}
              />
            </div>
          </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      id="email"
                        onChange={handleChanges}
                      placeholder="Email"
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor=""
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Password{" "}
                    </label>
                  </div>
                  <div className="mt-2">
                  <div className='flex flex-row  rounded hover:shadow-md hover:rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1'>
                    <input
                      className="flex h-10 w-full bg-transparent px-3 border-0 py-2 text-sm placeholder:text-gray-400  disabled:cursor-not-allowed disabled:opacity-50"
                      type= {showPassword?"text":"password"}
                      id='password'
                      onChange={handleChanges}
                      placeholder="Password"
                    />
                    <div className='-ml-8 text-center my-auto cursor-pointer'>
                      {showPassword ? <FaEyeSlash onClick={handleShowPassword}/> : <FaEye onClick={handleShowPassword}/>}
                    </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#E52A3D] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    disabled={loading}
                  >
                    {
                    loading ?(
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8"
                            ></path>
                        </svg>
                        <span className='pl-4'>Creating Account...</span>
                      </>
                    ): 'Create Account' 
                  }
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 space-y-3">

            {error && <p className="text-red-500">{error}</p>}

            {message && <p className="text-green-500">{message}
           
            
            </p>}
              <p className="text-sm text-center text-gray-600">
                Or Sign Up with
              </p>
              <O_auth />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
