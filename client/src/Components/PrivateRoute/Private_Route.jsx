import React from 'react'
import {useSelector} from 'react-redux'
import {Outlet, Navigate} from 'react-router-dom'


function Private_Route() {
    const {currentUser} = useSelector((state) => state.user)
    if (!currentUser) {
        return <Navigate to="/signin" />;
      }
    
      return <Outlet />;
}

export default Private_Route