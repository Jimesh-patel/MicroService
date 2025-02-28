const rideService = require('../services/ride.service')
const { validationResult } = require('express-validator')
const { publishToQueue } = require('../services/rabbitmq')
const axios = require('axios')

const io = require('socket.io-client');
const gatewaySocket = io(process.env.BASE_URL);
gatewaySocket.on('connect', () => {
    console.log('Ride microservice connected to Gateway WebSocket');
});

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { pickup, destination, vehicleType, selected_fare } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType, selected_fare });
        ride.otp = "";
        const rideWithUser = {
            ...ride.toObject(),  
            user: req.user
        };
        await publishToQueue('new-ride-available', JSON.stringify(rideWithUser));
        res.status(201).json({ message: 'Ride created successfully', rideWithUser });

    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: error.message });
    }
}

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.changeRideStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, status, captainId } = req.body;
    
    try {
        const ride = await rideService.changeRideStatus(rideId, status, captainId);
        res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;
    try {
        let ride = await rideService.startRide({ rideId, otp, captain: req.captain });


        const userResponse = await axios.get(`${process.env.BASE_URL}/users/user`, {
            params: {
                userId: ride.user   
            }
        });

        const user = userResponse.data;

        ride = {
            ...ride.toObject(),
            captain: req.captain,
            user: user
        };

        // Send message to the user
        gatewaySocket.emit('ride-started', ride);

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    const token = req.headers.authorization?.split(' ')[ 1 ] || req.cookies.token;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });
        const captain = await axios.patch(
            `${process.env.BASE_URL}/captains/status`,
            { status: 'active' },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        

        gatewaySocket.emit('ride-ended', ride);

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    } 
}

module.exports.getOngoingRidesForUser = async (req, res) => {
    try {
        const rides = await rideService.getOngoingRidesForUser(req.user._id);
        return res.status(200).json(rides);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

