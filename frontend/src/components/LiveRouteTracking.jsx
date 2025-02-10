import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const libraries = ['places'];

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const LiveRouteTracking = (props) => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const [directions, setDirections] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOMAPS_PRO_API_KEY,
        libraries,
    });

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

    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            });
        };

        updatePosition(); 

        const intervalId = setInterval(updatePosition, 1000000); // 1000 seconds

    }, []);

    useEffect(() => {
        if (isLoaded && props.ride) {
            const { pickup, destination } = props.ride;

            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: pickup,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
    }, [isLoaded, props.ride]);

    
    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading Maps</div>;
    }

    const options = {
        fullscreenControl: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: 'greedy' 
    };

    return (
        isLoaded ? (
            <GoogleMap
                options={options}
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
            >
                <Marker position={currentPosition} />
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        ) : <div>Loading...</div>
    );
};

export default LiveRouteTracking;