import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OnGoingRides = () => {
    const [rides, setRides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-user-rides`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setRides(response.data);
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        };

        fetchRides();
    }, []);

    return (
        <div>
            <div className='h-20 w-full bg-white flex items-center justify-end'>
                <img className='w-36 absolute left-5 top-5' src="Logo.png" alt="logo" />
                <i className="ri-menu-3-line absolute text-3xl right-5"></i>
            </div>
            <div className="p-6 bg-gray-100 min-h-screen">
                {rides.length > 0 ? (
                    <ul className="space-y-6">
                        {rides.map((ride) => (
                            <li
                                key={ride._id}
                                className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                                onClick={() => {
                                    navigate('/riding', { state: { ride } })
                                }}
                            >
                                <div className="flex flex-col">
                                    <div className='flex items-center gap-5 border-b-2 pb-2'>
                                        <i className="ri-map-pin-user-fill text-2xl "></i>
                                        <div>
                                            <h3 className='text-lg font-medium'>
                                                {ride.pickup?.split(' ')[0]}
                                            </h3>
                                            <p className='text-sm -mt-1 text-gray-600'>
                                                {ride.pickup?.split(' ').slice(1).join(' ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-5 pt-2'>
                                        <i className="ri-map-pin-range-line text-2xl"></i>
                                        <div>
                                            <h3 className='text-lg font-medium'>
                                                {ride.destination?.split(' ')[0]}
                                            </h3>
                                            <p className='text-sm -mt-1 text-gray-600'>
                                                {ride.destination?.split(' ').slice(1).join(' ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg text-gray-600 text-center">
                        No ongoing rides at the moment
                    </p>
                )}
            </div>

        </div>
    );
};

export default OnGoingRides;