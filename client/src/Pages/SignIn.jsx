import React, { useState } from 'react';
import Delivery from '../assets/Images/Delivery-Images.png';
import { Link, useNavigate } from 'react-router-dom';
import O_auth from '../Components/O-auth/O_auth.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFail, signInSuccess } from '../Redux/User-Slice/userSlice';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword , setShowPassword] = useState(false)
  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleShowPassword = () =>{
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        dispatch(signInFail(errorData.message));
        return;
      }

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
      dispatch(signInFail(error.message)); 
    }
  }

  return (
    <section className='lg:p-16 p-4 py-24 md:py-16 bg-zinc-50'>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Your image section */}
        <div className="relative items-end px-4 pb-10 hidden lg:block pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <img
              className="h-full w-full rounded-md object-cover object-top"
              src={Delivery}
              alt=""
            />
          </div>
        </div>

        {/* Sign in form section */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black text-center sm:text-4xl">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-black transition-all duration-200 hover:underline">
                Create a free account
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">

                {/* Email input */}
                <div>
                  <label htmlFor="email" className="text-base font-medium text-gray-900">Email address</label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded border hover:shadow-md hover:rounded-lg border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      id='email'
                      placeholder="Email"
                      onChange={handleChanges}
                    />
                  </div>
                </div>
                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-gray-900">Password</label>
                    <Link to='/forgotPassword' className="text-sm font-semibold text-black hover:underline">Forgot password?</Link>
                    
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
                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#E52A3D] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8"></path>
                        </svg>
                        <span className='pl-4'>Verifying...</span>
                      </>
                    ) : 'Get Started'}
                  </button>
                </div>
              </div>
            </form>
            {/* Error message section */}
            <div className="mt-3 space-y-3">
            {error && typeof error === 'string' && (
  <p className="text-red-500">{error}</p>
)}

              <p className="text-sm text-center text-gray-600">Or Sign In with</p>
              <O_auth />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
