import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import LiveRouteTracking from '../components/LiveRouteTracking';
import LiveDistanceTime from '../components/LiveDistanceTime';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Riding = () => {
    const location = useLocation();
    const { ride } = location.state || {};
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();
    const [payment, setPayment] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isExpanded, setIsExpanded] = useState(false);

    // Refs for GSAP animations
    const mapContainerRef = useRef(null);
    const infoContainerRef = useRef(null);
    const expandBtnRef = useRef(null);
    const infoContentRef = useRef(null);

    useEffect(() => {
        // Handle window resize for responsive behavior
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Reset expanded state when switching between mobile and desktop
            if (mobile !== isMobile) {
                setIsExpanded(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    // Use GSAP for animations with proper dependency tracking
    useGSAP(() => {
        if (isMobile) {
            if (isExpanded) {
                // Expanded state: hide map, show full info panel
                gsap.to(mapContainerRef.current, {
                    height: '0vh',
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(infoContainerRef.current, {
                    height: 'calc(100vh - 80px)', // Account for header height
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(expandBtnRef.current, {
                    rotation: 180,
                    duration: 0.3
                });
            } else {
                // Default mobile state: large map with peek of info at bottom
                gsap.to(mapContainerRef.current, {
                    height: 'calc(100vh - 180px)', // Leave space for the peek
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(infoContainerRef.current, {
                    height: '180px', // Height of the peek
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(expandBtnRef.current, {
                    rotation: 0,
                    duration: 0.3
                });
            }
        } else {
            // Desktop layout - fixed side-by-side layout
            gsap.set(mapContainerRef.current, {
                height: '100%',
                width: '65%'
            });
            gsap.set(infoContainerRef.current, {
                height: '100%',
                width: '35%'
            });
        }
    }, [isExpanded, isMobile]);

    // Socket event listener
    useEffect(() => {
        if (socket) {
            socket.on("ride-ended", () => {
                navigate('/home');
            });

            // Clean up listener when component unmounts
            return () => {
                socket.off("ride-ended");
            };
        }
    }, [socket, navigate]);

    const handlePayment = async () => {
        console.log("Ride:", ride);
        try {
            // Step 1: Request an order from backend
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/create-order`, {
                amount: ride?.fare,
                currency: "INR"
            });

            const data = response.data;
            if (!data.orderId) throw new Error("Order creation failed");

            console.log(data.orderId);
            console.log(ride?.captain.captain.paymentId);
            // Step 2: Open Razorpay Checkout
            const options = {
                key: import.meta.env.RAZORPAY_KEY_ID,
                amount: ride?.fare * 100,
                currency: "INR",
                name: "GoCab",
                description: "Ride Payment",
                order_id: data.orderId,
                handler: async function (response) {
                    // Step 3: Verify payment
                    const verifyRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/verify-payment`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        amount: ride?.fare,
                        driverAccountId: ride?.captain.captain.paymentId
                    });

                    const verifyData = verifyRes.data;
                    if (verifyData.success) {
                        // navigate("/home");
                        setPayment(true);
                    } else {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: ride?.captain.firstname || "Driver",
                    email: ride?.captain.email || "test@gmail.com"
                },
                theme: { color: "#3399cc" }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed. Try again.");
        }
    };

    // Build mini preview content for mobile collapsed state
    const renderMobilePreview = () => {
        if (!isMobile || isExpanded) return null;

        return (
            <div className="px-2 py-2 flex justify-around items-center">
                    {/* Live tracking info */}
                    <div className='p-4 rounded-lg w-full'>
                        <LiveDistanceTime ride={ride} />
                    </div>
            </div>
        );
    };

    return (
        <div className='h-screen relative overflow-hidden'>
            {/* Header with Logo */}
            <div className='h-20 w-full bg-white flex items-center justify-between border-b-2 z-20 relative px-5'>
                <img className='w-36' src="Logo.png" alt="logo" />
                <div className='flex items-center gap-4'>
                    <Link to='/home' className='h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full'>
                        <i className="text-lg font-medium ri-home-5-line"></i>
                    </Link>
                </div>
            </div>

            <div className={`relative ${isMobile ? 'flex flex-col' : 'flex flex-row'} h-[calc(100vh-80px)]`}>
                {/* Map Container */}
                <div
                    ref={mapContainerRef}
                    className={`${isMobile ? 'w-full' : 'w-2/3'} relative overflow-hidden`}
                >
                    {/* <LiveRouteTracking ride={ride} /> */}
                </div>

                {/* Info Container */}
                <div
                    ref={infoContainerRef}
                    className={`${isMobile ? 'w-full absolute bottom-0 left-0 right-0 rounded-t-2xl shadow-lg' : 'w-1/3 border-l-2'} 
                    bg-white transition-all duration-300 overflow-hidden`}
                >
                    {/* Mobile handle for pulling up/down */}
                    {isMobile && (
                        <div
                            className="w-full cursor-pointer"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2"></div>
                            {!isExpanded && renderMobilePreview()}
                        </div>
                    )}

                    {/* Full content (only shown when expanded on mobile) */}
                    <div
                        ref={infoContentRef}
                        className={`${isMobile && !isExpanded ? 'hidden' : 'flex flex-col h-full'}`}
                    >
                        <div className='p-6 flex-1 overflow-auto'>
                            <div className='flex flex-col'>
                                {/* Driver info section */}
                                <div className='mb-6 bg-gray-50 p-4 rounded-lg'>
                                    <div className='flex items-center gap-4 mb-3'>
                                        <div className='h-14 w-14 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <i className="ri-user-3-line text-2xl"></i>
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-lg'>{ride?.captain?.firstname || "Driver"} {ride?.captain?.lastname || ""}</h3>
                                            <div className='flex items-center gap-1'>
                                                <i className="ri-star-fill text-yellow-500"></i>
                                                <span>{ride?.captain?.rating || "4.8"}</span>
                                            </div>
                                        </div>

                                        <div className='ml-auto flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full'>
                                            <i className="ri-phone-line"></i>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2 text-sm'>
                                        <div className='px-3 py-1 bg-gray-200 rounded-full'>
                                            {ride?.captain?.vehicle?.model || "Vehicle"} • {ride?.captain?.vehicle?.color || "Color"}
                                        </div>
                                        <div className='px-3 py-1 bg-gray-200 rounded-full'>
                                            {ride?.captain?.vehicle?.plateNumber || "KA-XX-XXXX"}
                                        </div>
                                    </div>
                                </div>

                                {/* Route info */}
                                <div className='mb-2'>
                                    <div className='flex items-start gap-5 p-4 border-b'>
                                        <i className="ri-map-pin-user-fill text-xl text-blue-500 mt-1"></i>
                                        <div>
                                            <h3 className='text-base font-medium'>{ride?.pickup?.split(' ')[0]}</h3>
                                            <p className='text-sm text-gray-600'>{ride?.pickup?.split(' ').slice(1).join(' ')}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-start gap-5 p-2 border-b'>
                                        <i className="ri-map-pin-2-fill text-xl text-red-500 mt-1"></i>
                                        <div>
                                            <h3 className='text-base font-medium'>{ride?.destination?.split(' ')[0]}</h3>
                                            <p className='text-sm text-gray-600'>{ride?.destination?.split(' ').slice(1).join(' ')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Live tracking info */}
                                <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                                    <LiveDistanceTime ride={ride} />
                                </div>
                            </div>
                        </div>

                        {/* Payment section */}
                        <div className='p-3 border-t mt-auto'>
                            <div className='flex justify-between items-center mb-3'>
                                <h3 className='text-lg font-semibold'>Total fare</h3>
                                <span className='text-xl font-bold'>₹ {ride?.fare || "N/A"}</span>
                            </div>

                            {!payment ? (
                                <button
                                    className='w-full bg-black text-white font-semibold p-3 mb-4 rounded-lg'
                                    onClick={handlePayment}
                                >
                                    Pay Now
                                </button>
                            ) : (
                                <button className='w-full bg-green-600 text-white font-semibold p-3 mb-4 rounded-lg'>
                                    Payment Successful!
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Riding;