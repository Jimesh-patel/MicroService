import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import LiveRouteTracking from '../components/LiveRouteTracking';
import LiveDistanceTime from '../components/LiveDistanceTime';
import axios from 'axios';

const Riding = () => {
    const location = useLocation();
    const { ride } = location.state || {};
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();
    const [payment, setPayment] = useState(false);

    socket.on("ride-ended", () => {
        navigate('/home');
    });

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
                        alert("Payment Successful!");
                        // navigate("/home");
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
            setPayment(true);

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed. Try again.");
        }
    };

    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-1/2'>
                {/* <LiveRouteTracking ride={ride} /> */}
            </div>
            <div className='h-1/2 p-4'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-full'>
                        <div className='flex items-center gap-5 p-4 border-b-2'>
                            <i className="ri-map-pin-user-fill text-2xl"></i>
                            <div>
                                <h3 className='text-lg font-medium'>{ride?.pickup?.split(' ')[0]}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.pickup?.split(' ').slice(1).join(' ')}</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-5 p-4 border-b-2 mb-8'>
                            <i className="ri-map-pin-2-fill text-2xl"></i>
                            <div>
                                <h3 className='text-lg font-medium'>{ride?.destination?.split(' ')[0]}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination?.split(' ').slice(1).join(' ')}</p>
                            </div>
                        </div>

                        <LiveDistanceTime ride={ride} />
                    </div>
                </div>


                {!payment ? <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'
                    onClick={handlePayment}>
                    Pay ₹ {ride?.fare || "N/A"}
                </button> : <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'
                >Payment Successful!
                </button>}
            </div>
        </div>
    );
};

export default Riding;