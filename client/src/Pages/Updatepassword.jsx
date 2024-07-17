import { set } from 'mongoose';
import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
function Updatepassword() {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");


   const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(' ');
    const navigate = useNavigate();

    const handleChanges = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            

           
            const res = await fetch(`/api/auth//updatePassword?token=${token}&email=${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setMessage(data.message);
        setTimeout(() => {
            navigate('/signIn');
        }
        , 2000);
        setLoading(false);

            
        } catch (error) {
            setError(error.message);
        }
    }


  return (
   
    <div className="flex flex-wrap justify-center bg-gray-50 items-center h-screen">
        <div className=" border mx-4 p-10  rounded-xl  lg:w-1/3 shadow-xl bg-white">
        <h1 className="text-3xl  text-center mb-6 pb-4 font-bold text-gray-700">
            Update Password
            </h1>
            <form className="px-6 py-6 " onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-black  text-sm  mb-2" htmlFor="password">
                Password
                </label>
                <input
                className=" appearance-none border  hover:shadow-md hover:rounded-lg  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChanges}
                />
            </div>
           
            <div className='flex items-center pt-6 mx-auto'>
            <div className="flex mx-auto items-center justify-between">
                <button
                className="bg-[#E52A3D] hover:bg-orange-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                >
                Update Password
                </button>
            </div>
            </div>
            <div className="text-center mt-4">
                <Link to="/signIn" className="text-[#E52A3D] hover:text-orange-600">
                Back to Sign In
                </Link>
            </div>

            <div className="text-center mt-4">
                {error && <div className="text-red-500 text-center mt-4">{error}</div>}
                {message && <div className="text-green-500 text-center mt-4">{message}</div>}
            </div>
            </form>
        </div>  
    </div>
  )
}

export default Updatepassword