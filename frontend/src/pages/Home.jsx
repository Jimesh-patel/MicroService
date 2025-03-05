import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import { toast } from 'react-toastify';

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const suggestionsRef = useRef(null)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const mapContainerRef = useRef(null)
    const formContainerRef = useRef(null)
    const formContentRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [selected_fare, setSelectedFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)
    const [loading, setLoading] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id });

        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (mobile !== isMobile) {
                setPanelOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    useEffect(() => {
        socket.on('ride-started', ride => {
            setWaitingForDriver(false);
            navigate('/riding', { state: { ride } });
        });

        const handleRideConfirmed = (ride) => {
            setRide(ride);
            setVehicleFound(false);
            setWaitingForDriver(true);
        };

        socket.on('ride-confirmed', handleRideConfirmed);

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed);
        };
    }, [socket]);

    useEffect(() => {
        const handleNoCaptains = (data) => {
            console.log(data);
            toast.error("No captains available at the moment");
        };
    
        socket.on('no-captains', handleNoCaptains);
    
        return () => {
            socket.off('no-captains', handleNoCaptains);
        };
    }, [socket]);

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (isMobile) {
            // Mobile animation logic
            if (panelOpen) {
                // Hide map and show form at top when panel is open on mobile
                gsap.to(mapContainerRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    height: 0,
                    overflow: 'hidden'
                });
                gsap.to(formContainerRef.current, {
                    height: '87vh',
                    duration: 0.3
                });
                gsap.to(formContentRef.current, {
                    opacity: 1,
                    visibility: 'visible'
                });
                gsap.to(panelRef.current, {
                    height: 'calc(100vh - 150px)',
                    padding: 24,
                    overflow: 'auto'
                });
                gsap.to(panelCloseRef.current, {
                    opacity: 1
                });
                gsap.to(suggestionsRef.current, {
                    position: 'relative',
                    height: 'auto',
                    maxHeight: '300px',
                    visibility: 'visible'
                });
            } else {
                // Show map and position form at bottom when panel is closed on mobile
                gsap.to(mapContainerRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    height: 'calc(70vh)',
                    overflow: 'visible'
                });
                gsap.to(formContainerRef.current, {
                    height: '26vh',
                    duration: 0.3
                });
                gsap.to(formContentRef.current, {
                    opacity: 1,
                    visibility: 'visible'
                });
                gsap.to(panelRef.current, {
                    height: 0,
                    padding: 0,
                });
                gsap.to(panelCloseRef.current, {
                    opacity: 0
                });
                gsap.to(suggestionsRef.current, {
                    position: 'relative',
                    height: 'auto',
                    maxHeight: '30vh',
                    visibility: 'visible'
                });
            }
        } else {
            // Desktop animation logic - updated to hide form when panel is open
            if (panelOpen) {
                gsap.to(formContentRef.current, {
                    opacity: 0,
                    visibility: 'hidden',
                    duration: 0.2
                });
                gsap.to(panelRef.current, {
                    height: '90%',
                    padding: 24,
                    delay: 0.1
                });
                gsap.to(panelCloseRef.current, {
                    opacity: 1
                });
                gsap.to(suggestionsRef.current, {
                    height: 0,
                    visibility: 'hidden',
                    opacity: 0
                });
            } else {
                gsap.to(panelRef.current, {
                    height: '0%',
                    padding: 0,
                    overflow: 'hidden'
                });
                gsap.to(panelCloseRef.current, {
                    opacity: 0
                });
                gsap.to(formContentRef.current, {
                    opacity: 1,
                    visibility: 'visible',
                    delay: 0.2
                });
                gsap.to(suggestionsRef.current, {
                    height: 'auto',
                    visibility: 'visible',
                    opacity: 1
                });
            }
        }
    }, [panelOpen, isMobile]);

    useGSAP(function () {
        const showPanel = (panelRef) => {
            if (isMobile) {
                gsap.to(panelRef, {
                    transform: 'translateY(0)'
                });
            } else {
                // For desktop, completely replace the form area with the panel
                gsap.to(formContentRef.current, {
                    opacity: 0,
                    visibility: 'hidden',
                    duration: 0.2
                });
                gsap.to(suggestionsRef.current, {
                    height: 0,
                    visibility: 'hidden',
                    opacity: 0
                });
                gsap.to(panelRef, {
                    transform: 'translateY(0)',
                    height: '100%',
                    top: 0,
                    position: 'absolute',
                    width: '100%'
                });
            }

            // Reset panel state when opening any panel
            if (panelOpen) {
                setPanelOpen(false);
            }
        };

        const hidePanel = (panelRef) => {
            if (isMobile) {
                gsap.to(panelRef, {
                    transform: 'translateY(100%)'
                });
            } else {
                gsap.to(panelRef, {
                    transform: 'translateY(100%)'
                });
                
                // Only restore form visibility if no other panels are active
                if (!vehiclePanel && !confirmRidePanel && !vehicleFound && !waitingForDriver) {
                    gsap.to(formContentRef.current, {
                        opacity: 1,
                        visibility: 'visible',
                        delay: 0.2
                    });
                    gsap.to(suggestionsRef.current, {
                        height: 'auto',
                        visibility: 'visible',
                        opacity: 1
                    });
                }
            }
        };

        if (vehiclePanel) {
            showPanel(vehiclePanelRef.current);
        } else {
            hidePanel(vehiclePanelRef.current);
        }
    }, [vehiclePanel, isMobile, panelOpen, confirmRidePanel, vehicleFound, waitingForDriver]);

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
                ...(isMobile ? {} : {
                    height: '100%',
                    top: 0,
                    position: 'absolute',
                    width: '100%'
                })
            });
            
            // Hide form content when panel opens in desktop
            if (!isMobile) {
                gsap.to(formContentRef.current, {
                    opacity: 0,
                    visibility: 'hidden'
                });
                gsap.to(suggestionsRef.current, {
                    height: 0,
                    visibility: 'hidden',
                    opacity: 0
                });
            }
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [confirmRidePanel, isMobile]);

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
                ...(isMobile ? {} : {
                    height: '100%',
                    top: 0,
                    position: 'absolute',
                    width: '100%'
                })
            });
            
            // Hide form content when panel opens in desktop
            if (!isMobile) {
                gsap.to(formContentRef.current, {
                    opacity: 0,
                    visibility: 'hidden'
                });
                gsap.to(suggestionsRef.current, {
                    height: 0,
                    visibility: 'hidden',
                    opacity: 0
                });
            }
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [vehicleFound, isMobile]);

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)',
                ...(isMobile ? {} : {
                    height: '100%',
                    top: 0,
                    position: 'absolute',
                    width: '100%'
                })
            });
            
            // Hide form content when panel opens in desktop
            if (!isMobile) {
                gsap.to(formContentRef.current, {
                    opacity: 0,
                    visibility: 'hidden'
                });
                gsap.to(suggestionsRef.current, {
                    height: 0,
                    visibility: 'hidden',
                    opacity: 0
                });
            }
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [waitingForDriver, isMobile]);

    async function findTrip() {
        setLoading(true);
        if (!pickup || !destination) {
            toast.error('Please enter both pickup and destination');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/price/fare`, {
                pickup,
                destination
            });
            console.log(response.data);
            setFare(response.data);
        } catch (error) {
            setLoading(false);
            toast.error("Invalid Addresses");
            return;
        }
        setVehiclePanel(true);
        setPanelOpen(false);
        setLoading(false);
    }

    async function createRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType,
                selected_fare
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Internal Server Error');
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            <div className='h-20 w-full bg-white flex items-center justify-end border-b-2 z-20 relative'>
                <img className='w-36 absolute left-5 top-5' src="Logo.png" alt="logo" />
                <button className="absolute right-5 z-20" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className="ri-menu-3-line text-3xl"></i>
                </button>
                {menuOpen && (
                    <div className="absolute top-16 right-5 bg-white shadow-lg rounded-lg w-40 z-20">
                        <ul>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/ongoing-rides')}>Rides</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/user/logout')}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className='relative h-[calc(100vh-80px)]'>
                {/* Map Container */}
                <div
                    ref={mapContainerRef}
                    className='w-full h-auto md:w-2/3 md:h-full md:float-left md:border-r-2'
                    style={{ height: isMobile ? '70vh' : '100%' }}
                >
                    {/* <LiveTracking /> */}
                </div>

                {/* Form Container */}
                <div
                    ref={formContainerRef}
                    className={`${isMobile ? 'absolute bottom-0 left-0 right-0' : 'relative md:w-1/3 md:h-full md:float-right'} 
                    bg-white transition-all duration-300 overflow-hidden z-10`}
                    style={{ height: isMobile ? '30vh' : '100%' }}
                >
                    <div className='flex flex-col h-full relative'>

                        {/* Form content */}
                        <div ref={formContentRef} className='transition-all duration-300'>
                            <div ref={suggestionsRef} className='p-5 bg-white'>
                                <h5
                                    ref={panelCloseRef}
                                    onClick={() => setPanelOpen(false)}
                                    className='absolute opacity-0 right-6 top-5 text-2xl cursor-pointer'
                                >
                                    <i className="ri-arrow-down-wide-line"></i>
                                </h5>
                                <h4 className='text-2xl font-semibold'>Find trip</h4>
                                <form className='relative py-4' onSubmit={submitHandler}>
                                    <input
                                        onClick={() => {
                                            setPanelOpen(true);
                                            setActiveField('pickup');
                                        }}
                                        value={pickup}
                                        onChange={handlePickupChange}
                                        className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                                        type="text"
                                        placeholder='Add a pick-up location'
                                        required
                                    />
                                    <input
                                        onClick={() => {
                                            setPanelOpen(true);
                                            setActiveField('destination');
                                        }}
                                        value={destination}
                                        onChange={handleDestinationChange}
                                        className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
                                        type="text"
                                        placeholder='Enter your destination'
                                        required
                                    />
                                </form>
                                <button
                                    onClick={findTrip}
                                    className='bg-black text-white px-4 py-2 rounded-lg w-full'
                                >
                                    {loading ? "Loading..." : "Find Trip"}
                                </button>
                            </div>
                        </div>

                        {/* Suggestions panel */}
                        <div
                            ref={panelRef}
                            className="bg-white overflow-hidden"
                            style={{ height: 0 }}
                        >
                            <LocationSearchPanel
                                suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                                setPickup={setPickup}
                                setDestination={setDestination}
                                activeField={activeField}
                            />
                        </div>
                    </div>
                    {/* panels */}
                    <div ref={vehiclePanelRef} className='fixed w-full z-40 bottom-0 translate-y-full bg-white'>
                        <VehiclePanel
                            selectVehicle={setVehicleType}
                            setSelectedFare={setSelectedFare}
                            fare={fare}
                            setConfirmRidePanel={setConfirmRidePanel}
                            setVehiclePanel={setVehiclePanel}
                        />
                    </div>
                    <div ref={confirmRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white'>
                        <ConfirmRide
                            createRide={createRide}
                            pickup={pickup}
                            destination={destination}
                            fare={fare}
                            vehicleType={vehicleType}
                            setConfirmRidePanel={setConfirmRidePanel}
                            setVehicleFound={setVehicleFound}
                        />
                    </div>
                    <div ref={vehicleFoundRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white'>
                        <LookingForDriver
                            createRide={createRide}
                            pickup={pickup}
                            destination={destination}
                            fare={fare}
                            vehicleType={vehicleType}
                            setVehicleFound={setVehicleFound}
                        />
                    </div>
                    <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white'>
                        <WaitingForDriver
                            ride={ride}
                            vehicleType={vehicleType}
                            setVehicleFound={setVehicleFound}
                            setWaitingForDriver={setWaitingForDriver}
                            waitingForDriver={waitingForDriver}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;