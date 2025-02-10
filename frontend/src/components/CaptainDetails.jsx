import React, { useContext, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainDetails = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [status, setStatus] = useState(captain.status);

    const changeStatus = async (newStatus) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setStatus(newStatus);
            setCaptain(response.data.captain);
        } catch (error) {
            console.error('Error changing status:', error);
        }
    };

    return (
        <div>
            <div className="fixed bottom-56 right-7">
                <button
                    className={`relative w-12 h-6 flex items-center rounded-full transition-all duration-300 shadow-lg ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    onClick={() => changeStatus(status === 'active' ? 'inactive' : 'active')}
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${status === 'active' ? 'translate-x-7' : 'translate-x-1'
                            }`}
                    ></div>
                </button>
            </div>
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
            <div className='flex p-3 mt-5 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
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