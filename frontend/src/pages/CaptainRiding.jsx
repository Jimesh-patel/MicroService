import React, { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveRouteTracking from '../components/LiveRouteTracking'
import LiveDistanceTime from '../components/LiveDistanceTime'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const navigate = useNavigate()

    useGSAP(() => {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.5,
                ease: 'power2.out'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.5,
                ease: 'power2.in'
            })
        }
    }, [finishRidePanel])

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
                    {/* <LiveRouteTracking ride={rideData} /> */}
                </div>

                {/* Right side panel - Only visible on desktop */}
                <div className='hidden md:block md:w-1/3 md:h-full md:bg-white md:border-l md:border-gray-200 md:overflow-y-auto'>
                    <div className='h-full flex flex-col'>
                        <div className='flex-grow p-6'>
                            <h4 className='text-2xl font-semibold mb-4'>Trip Details</h4>
                            <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                                {/* <LiveDistanceTime ride={rideData} /> */}
                            </div>

                        </div>
                        <div className='p-6 '>
                            <button
                                onClick={() => setFinishRidePanel(true)}
                                className='w-full bg-green-600 text-white font-semibold p-4 rounded-lg hover:bg-green-700 transition-colors'
                            >
                                Complete Ride
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom panel - Only visible on mobile */}
                <div className='md:hidden flex flex-col justify-end h-[30vh] w-full absolute bottom-0 left-0 right-0'>
                    <div
                        className='h-full bg-yellow-400 pt-2 pb-4 px-4'
                        onClick={() => setFinishRidePanel(true)}
                    >
                        <h5 className='p-1 text-center'>
                            <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
                        </h5>
                        <div className='my-4'>
                            {/* <LiveDistanceTime ride={rideData} /> */}
                        </div>
                        <div className='flex items-center justify-center px-3 py-1'>
                            <button className='bg-green-600 text-white font-semibold p-4 px-7 rounded-lg hover:bg-green-700 transition-colors'>
                                Complete Ride
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Finish Ride Panel */}
            <div
                ref={finishRidePanelRef}
                className='h-[calc(100vh-5rem)] fixed w-full md:w-1/3 md:right-0 z-[500] bottom-0 translate-y-full bg-white px-6 py-8 rounded-t-3xl md:rounded-none shadow-lg'
            >
             
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>
        </div>
    )
}

export default CaptainRiding