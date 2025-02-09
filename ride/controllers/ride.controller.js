const rideService = require('../services/ride.service')
const { validationResult } = require('express-validator')
const { publishToQueue } = require('../services/rabbitmq')
const rideModel = require('../models/ride.model')

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
};