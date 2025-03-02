import React, { useContext, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainDetails = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext);

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-2 px-3'>
                    <img className='h-10 w-10 object-cover' src="https://cdn-icons-png.flaticon.com/512/1581/1581908.png" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                </div>
                <div className='mr-3'>
                    <h4 className='text-xl font-semibold'>₹295.20</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-5 bg-gray-100 rounded-xl justify-around gap-5 items-center'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>30 KM</h5>
                    <p className='text-sm text-gray-600'>Total Distance</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>12</h5>
                    <p className='text-sm text-gray-600'>Total Rides</p>
                </div>
            </div>

        </div>
    );
};

export default CaptainDetails;