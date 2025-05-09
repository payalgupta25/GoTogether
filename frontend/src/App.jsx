import React, { use, useEffect } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import AllRides from './pages/AllRides'
import ProfilePage from './pages/ProfilePage'
import CreateRide from './pages/CreateRide'
import { Toaster } from 'react-hot-toast'
import VerifyEmail from './pages/VerifyEmail'
import Card from './pages/Card'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/home" element={<UserProtectWrapper><Home /></UserProtectWrapper>} />
        <Route path="/all-rides" element={<AllRides />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-ride" element={<CreateRide />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/ride/:id" element={<Card />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
