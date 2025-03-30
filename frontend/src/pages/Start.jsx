import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center relative bg-gray-100">

      <div className="absolute top-5 left-5">
        <img className="w-36 md:w-44" src="Logo.png" alt="logo" />
      </div>

      <div className="flex-grow flex items-center justify-center w-full px-5">
        <img className="w-full max-w-[1000px] max-h-[600px] object-fill -mt-20" src="background.png" alt="background" />
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-[300px]">
        <Link
          to="/login"
          className="block bg-black text-white py-3 text-center rounded-3xl"
        >
          Get Started
        </Link>
      </div>

    </div>
  );
};

export default Start;
