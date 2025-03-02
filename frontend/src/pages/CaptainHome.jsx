import React, { useRef, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'
import { toast } from 'react-toastify'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [ride, setRide] = useState(null)
    const [loading, setLoading] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const detailsPanelRef = useRef(null)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [status, setStatus] = useState(captain.status);

    useEffect(() => {
        socket.emit('join', {
            userType: 'captain',
            userId: captain._id
        })

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                }, error => {
                    toast.error("Location access is required for this app")
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [captain._id, socket])

    useEffect(() => {
        const handleNewRide = (data) => {
            console.log('New ride:', data)
            setRide(data)
            setRidePopupPanel(true)
        }

        socket.on('new-ride', handleNewRide)

        return () => {
            socket.off('new-ride', handleNewRide)
        }
    }, [socket])

    const handleBeforeUnload = async (event) => {
        event.preventDefault();
        try {
            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/status`,
                { status: 'inactive' },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        } catch (error) {
            console.error('Error updating captain status:', error);
        }
    };

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    async function confirmRide() {
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/captains/confirm`,
                { ride },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to confirm ride');
        } finally {
            setLoading(false);
        }
    }

    useGSAP(() => {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.5,
                ease: 'power2.out'
            });
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.5,
                ease: 'power2.in'
            });
        }
    }, [ridePopupPanel]);

    useGSAP(() => {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.5,
                ease: 'power2.out'
            });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.5,
                ease: 'power2.in'
            });
        }
    }, [confirmRidePopupPanel]);

    

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
            setCaptain({ ...captain, status: newStatus });
        } catch (error) {
            console.error('Error changing status:', error);
        }
    };

    return (
        <div className='h-screen relative overflow-hidden'>
            {/* Header */}
            <div className='h-20 w-full bg-white flex items-center justify-end shadow-sm'>
                <img className='w-36 absolute left-5 top-5' src="Logo.png" alt="logo" />
                <button className="absolute right-5 z-20" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className="ri-menu-3-line text-3xl"></i>
                </button>
                {menuOpen && (
                    <div className="absolute top-16 right-5 bg-white shadow-lg rounded-lg w-40 z-20">
                        <ul>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => navigate('/captain-rides')}>
                                Rides
                            </li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => navigate('/captain/logout')}>
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Responsive layout container */}
            <div className='flex flex-col md:flex-row h-[calc(100vh-5rem)]'>
                {/* Map Area - Full width on mobile, left side on desktop */}
                <div className='h-[70vh] md:h-full md:w-2/3 md:flex-shrink-0'>
                    <LiveTracking />
                </div>

                {/* Right side panel - Only visible on desktop */}
                <div className='hidden md:block md:w-1/3 md:h-full md:bg-white md:border-l md:border-gray-200 md:overflow-y-auto md:p-6'>

                    <div className='flex items-center justify-between mb-10'>
                        <h4 className='text-2xl font-semibold'>Captain Dashboard</h4>
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
                    <CaptainDetails />
                </div>

                {/* Bottom panel - Only visible on mobile */}
                <div className='md:hidden flex flex-col justify-end h-[40vh] w-full absolute bottom-0 left-0 right-0'>
                    <div className='h-full p-6 bg-white rounded-t-3xl shadow-lg'>
                        <div className='flex items-center justify-between mb-5'>
                            <h4 className='text-2xl font-semibold'>Captain Dashboard</h4>
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
                        <CaptainDetails />
                    </div>
                </div>
            </div>

            {/* Ride Popup Panel */}
            <div
                ref={ridePopupPanelRef}
                className='fixed w-full md:w-1/3 md:right-0 z-40 bottom-0 translate-y-full bg-white px-6 py-8 rounded-t-3xl md:rounded-none shadow-lg'
            >
                <div className="absolute top-3 left-0 right-0 flex justify-center md:hidden">
                    <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
                </div>
                <RidePopUp
                    ride={ride}
                    loading={loading}
                    setRidePopupPanel={setRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* Confirm Ride Popup Panel */}
            <div
                ref={confirmRidePopupPanelRef}
                className='fixed h-[calc(100vh-5rem)] w-full md:w-1/3 md:right-0 z-30 bottom-0 translate-y-full bg-white px-6 py-8 rounded-t-3xl md:rounded-none shadow-lg overflow-y-auto'
            >
                <div className="absolute top-3 left-0 right-0 flex justify-center md:hidden">
                    <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
                </div>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
}

export default CaptainHome