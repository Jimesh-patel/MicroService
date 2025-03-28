
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const usersocket = io(import.meta.env.VITE_USER_BASE_URL);
const captainsocket = io(import.meta.env.VITE_CAPTAIN_BASE_URL);


const SocketProvider = ({ children }) => {
    useEffect(() => {
        
        usersocket.on('connect', () => {
            console.log('User connected to server');
        });

        usersocket.on('disconnect', () => {
            console.log('User disconnected from server');
        });

        captainsocket.on('connect', () => {
            console.log('Captain connected to server');
        });

        captainsocket.on('disconnect', () => {
            console.log('Captain disconnected from server');
        });

    }, []);



    return (
        <SocketContext.Provider value={{ usersocket, captainsocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;