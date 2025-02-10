import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="h-screen flex flex-col justify-between">

      <div className="absolute top-0 left-0 p-5 ">
        <img className="w-40" src="Logo.png" alt="logo" />
      </div>

      <div className="flex-grow flex items-center justify-center">
        <img className="max-w-full max-h-full object-contain" src="background.png" alt="background" />
      </div>

      <div className="text-center p-5">
        <Link
          to="/login"
          className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg"
        >
          Get Started
        </Link>
      </div>

    </div>

  )
}

export default Start