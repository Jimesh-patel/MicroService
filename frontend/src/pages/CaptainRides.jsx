import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainRides = () => {
    const [rides, setRides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-captain-rides`, {
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
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <div className='h-20 w-full bg-white flex items-center justify-between px-4 md:px-6 lg:px-8 shadow-sm'>
                <img className='w-24 md:w-36' src="Logo.png" alt="logo" />
                <button className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => navigate('/captain-home')}>
                    <i className="ri-arrow-left-s-line text-2xl md:text-3xl"></i>
                </button>
            </div>
            
            {/* Main content - Grid layout based on screen size */}
            <div className="flex-1 p-4 md:p-6">
                <div className="container mx-auto">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Your Rides</h2>
                    
                    {rides.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {rides.map((ride) => (
                                <div
                                    key={ride._id}
                                    className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer h-full"
                                    onClick={() => {
                                        navigate('/captain-riding', { state: { ride } })
                                    }}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className='flex items-center gap-3 border-b-2 pb-2'>
                                            <i className="ri-map-pin-user-fill text-xl flex-shrink-0 "></i>
                                            <div className="overflow-hidden">
                                                <h3 className='text-base font-medium truncate'>
                                                    {ride.pickup?.split(' ')[0]}
                                                </h3>
                                                <p className='text-xs text-gray-600 truncate'>
                                                    {ride.pickup?.split(' ').slice(1).join(' ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3 pt-2 mt-auto'>
                                            <i className="ri-map-pin-range-line text-xl flex-shrink-0 "></i>
                                            <div className="overflow-hidden">
                                                <h3 className='text-base font-medium truncate'>
                                                    {ride.destination?.split(' ')[0]}
                                                </h3>
                                                <p className='text-xs text-gray-600 truncate'>
                                                    {ride.destination?.split(' ').slice(1).join(' ')}
                                                </p>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <i className="ri-route-line text-4xl text-gray-400 mb-2"></i>
                            <p className="text-lg text-gray-600">
                                No ongoing rides at the moment
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaptainRides;