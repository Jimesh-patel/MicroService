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

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])

    return (
        <div className='h-screen flex flex-col'>
            <div className='h-20 w-full bg-white flex items-center justify-end'>
                <img className='w-36 absolute left-5 top-5' src="Logo.png" alt="logo" />
                <button className="absolute right-5 z-20" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className="ri-menu-3-line text-3xl"></i>
                </button>
                {menuOpen && (
                    <div className="absolute top-16 right-5 bg-white shadow-lg rounded-lg w-40 z-20">
                        <ul>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/captain-rides')}>Rides</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() =>  navigate('/captain/logout') }>Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className='flex-grow relative'>
                {/* <LiveRouteTracking ride={rideData} /> */}
            </div>

            <div className='h-[30%] items-center justify-between bg-yellow-400'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center ' onClick={() => { }}>
                    <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
                </h5>
                <div className='my-4'>
                    <LiveDistanceTime ride={rideData} />
                </div>
                <div className='flex items-center justify-center px-3 py-1'>
                    
                    <button className='bg-green-600 text-white font-semibold p-4 px-7 rounded-lg'>Complete Ride</button>
                </div>
            </div>

            <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    )
}

export default CaptainRiding