import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import OnGoingRides from './pages/OnGoingRides'

import 'remixicon/fonts/remixicon.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CaptainRides from './pages/CaptainRides';


const App = () => {

  console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

  return (
    <div>
      
      <ToastContainer />

      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
  
        <Route path='/riding' element={<Riding />} />
        <Route path='/ongoing-rides' element={<OnGoingRides />} />
        <Route path='/captain-rides' element={<CaptainRides />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />

        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/home'
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
        
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>

        } />
        <Route path='/captain/logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />
         <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App