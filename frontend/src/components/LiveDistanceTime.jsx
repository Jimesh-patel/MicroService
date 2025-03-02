import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LiveDistanceTime = (props) => {
  const [liveLocation, setLiveLocation] = useState(null)
  const [distanceTime, setDistanceTime] = useState({ distance: '', time: '' })

  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLiveLocation({ latitude, longitude })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }

    updateLocation()
    const intervalId = setInterval(updateLocation, 1000000) // 1000 seconds

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (liveLocation) {
      const fetchDistanceTime = async () => {
        try {
          const response = await axios.get('https://maps.gomaps.pro/maps/api/distancematrix/json', {
            params: {
              origins: `${liveLocation.latitude},${liveLocation.longitude}`,
              destinations: props.ride.destination,
              key: import.meta.env.VITE_GOMAPS_PRO_API_KEY
            }
          })
          const data = response.data.rows[0].elements[0]
          setDistanceTime({
            distance: data.distance.text,
            time: data.duration.text
          })
        } catch (error) {
          console.error('Error fetching distance and time:', error)
        }
      }

      fetchDistanceTime()
    }
  }, [liveLocation, props.ride.destination])

  return (
    <div className="flex  items-center p-3 justify-around">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-700">Distance</h4>
        <p className="text-sm text-gray-600">{distanceTime?.distance || "N/A"}</p>
      </div>
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-700">Time</h4>
        <p className="text-sm text-gray-600">{distanceTime?.time || "N/A"}</p>
      </div>
    </div>

  )
}

export default LiveDistanceTime