const rideService = require('../services/ride.service')
const { validationResult } = require('express-validator')
const { publishToQueue } = require('../services/rabbitmq')
const rideModel = require('../models/ride.model')
const { param } = require('../routes/ride.route')
const axios = require('axios')
const { sendMessageToSocketId } = require('../socket')

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        ride.otp = "";
        const rideWithUser = {
            ...ride.toObject(),  
            user: req.user
        };
        console.log(rideWithUser);
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

    const { rideId, status } = req.body;
    
    try {
        const ride = await rideService.changeRideStatus(rideId, status);
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

        sendMessageToSocketId(user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};