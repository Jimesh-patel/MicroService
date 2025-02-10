import React, { useState, useEffect } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const options = {
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    gestureHandling: 'greedy' 
};

const LiveTracking = () => {
    const [ currentPosition, setCurrentPosition ] = useState(center);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOMAPS_PRO_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
                options={options}
            >
                <Marker position={currentPosition} />
            </GoogleMap>
        </LoadScript>
    )
}

export default LiveTracking;