import React from 'react'

const RidePopUp = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-4'>New Ride Available!</h3>
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 rounded-full object-cover w-12' src="https://cdn-icons-png.flaticon.com/512/4439/4439947.png" alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{props.ride?.distance < 1000 ? `${props.ride?.distance} meters` : `${(props.ride?.distance / 1000).toFixed(2)} KM`}</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-2xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.pickup?.split(' ')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup?.split(' ').slice(1).join(' ')}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-2xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.destination?.split(' ')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination?.split(' ').slice(1).join(' ')}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-currency-line text-2xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹ {props.ride?.fare} </h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-time-line text-2xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'> 
                                {Math.floor(props.ride?.duration / 3600)}h  {Math.floor((props.ride?.duration % 3600) / 60)}m  {props.ride?.duration % 60} s 
                            </h3>
                        </div>
                    </div>
                </div>
                <div className='w-full '>
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide()

                    }} className=' bg-green-600 w-full text-white font-semibold p-2 rounded-lg'>Accept</button>

                    <button onClick={() => {
                        props.setRidePopupPanel(false)

                    }} className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg'>Ignore</button>

                </div>
            </div>
        </div>
    )
}

export default RidePopUp