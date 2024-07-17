import React from 'react'
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { GoogleAuthProvider,signInWithPopup,getAuth } from "firebase/auth";
import { app } from '../../Firebase/firebase';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../Redux/User-Slice/userSlice';
import { signInFail } from '../../Redux/User-Slice/userSlice';

function O_auth() {
    const auth = getAuth(app);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const data = await signInWithPopup(auth, provider);
           
            
            const res = await fetch('/api/auth/google',{ 
                method:'POST',
                headers:{
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({
                  
                  name:data.user.displayName,
                  email:data.user.email,
                  googlePhoto:data.user.photoURL, 
                  isVerified:data.user.emailVerified,
                  isAnonymous:data.user.isAnonymous
                }),

               
              });
             
              const value = await res.json();

              if(res.ok){
                dispatch(signInSuccess(value))
                navigate('/')
              }
              if(!res.ok){
                console.log(value.message)
                return;
              }
              
            
        } catch (error) {
            signInFail(error);
        }
    }

  return (
    <div className="flex justify-center gap-6">
        <button type='button' onClick={handleChange}>
                <FaGoogle className="h-7 w-7 text-[#DB4437]" />
        </button>
        <button type='button' onClick={handleChange}>
                <FaFacebook className="h-7 w-7 text-[#2563EB]" />
        </button>
              </div>

  )
}

export default O_auth