import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveRouteTracking from '../components/LiveRouteTracking'
import LiveDistanceTime from '../components/LiveDistanceTime'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    socket.on("ride-ended", () => {
        navigate('/home')
    })

    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-1/2'>
                <LiveRouteTracking
                    ride={ride}
                />
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

                <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'
                    onClick={() => {
                        navigate('/home')
                    }}>
                    Pay ₹ {ride?.fare || "N/A"}
                </button>
            </div>

        </div>
    )
}

export default Riding