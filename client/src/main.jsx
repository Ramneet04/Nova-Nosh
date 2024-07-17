import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {Provider} from 'react-redux';
import {persistor, store} from './Redux/store.js';
import { PersistGate } from 'redux-persist/integration/react'


// Importing the pages
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import Menu from './Pages/Menu.jsx'
import Order_Online from './Pages/Order_Online.jsx'
import Reservation from './Pages/Reservation.jsx'
import Contact from './Pages/Contact.jsx'
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import VerifyEmail from './Pages/VerifyEmail.jsx'
import ForgotPassword from './Pages/ForgotPassword.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
import Updatepassword from './Pages/Updatepassword.jsx'

import Private_Route from './Components/PrivateRoute/Private_Route.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Profile from './Pages/Profile.jsx'
import MenuSlug from './Pages/AdminSide/EditMenu/MenuSlug.jsx'
import Cart from './Pages/Cart.jsx'
import Checkout from './Pages/Checkout.jsx'
import OrderStatus from './Pages/OrderStatus.jsx'
import OrderDetails from './Pages/OrderDetails.jsx'
import EditTable from './Pages/EditTable.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/menu',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<Menu/>
          }
        ]
      
      },
      {
        path: '/account/editTable/:tableId',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<EditTable/>
          }
        ]
      
      },
      {
        path: '/cart',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<Cart/>
          }
        ]
      
      },
      {
        path: '/checkout/:orderId',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<Checkout/>
          }
        ]
      
      },{
        path: '/orderDetails/:orderId',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<OrderDetails/>
          }
        ]
      
      }
      
      ,{
        path: '/orderStatus',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<OrderStatus/>
          }
        ]
      
      },
      {
        path:'/signIn',
        element:<SignIn/>
      },
      {
        path:'/signUp',
        element:<SignUp/>
      },
      {
        path: '*',
        element: <div>404 Not Found</div>
      },
      {
        path:'/order',
        element:<Order_Online/>
      },
      
      {
        path:'/reservations',
        element:<Reservation/>
      },
     
      {
        path:'/contact',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<Contact/>
          }
        ]
      
      },
      {
        path:'/verifyEmail',
        element:<VerifyEmail/>
      },
      {
        path:'/forgotPassword',
        element:<ForgotPassword/>
      },
      {
        path:'/resetPassword',
        element:<ResetPassword/>
      },
      {
        path:'/updatePassword',
        element:<Updatepassword/>
      },

      {
        path:'/dashBoard',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<Dashboard/>
          }
        ]
      },
      {
        path:'/account',
        element:<Private_Route/>,
        children:[
          {
            index:true,
            element:<Profile/>
          }
        ]
      },
      {
        path:"/menu/:menuSlug",
        element:<MenuSlug/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root'))
.render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
    </PersistGate>
  </React.StrictMode>
  
)


