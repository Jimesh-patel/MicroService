const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');
const axios = require('axios');
const { params } = require('express-validator');
const { subscribeToQueue } = require('../services/rabbitmq');
const { sendMessageToSocketId } = require('../socket');



module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

module.exports.changeCaptainStatus = async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['active', 'inactive', 'busy'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const captain = await captainService.changeCaptainStatus(req.captain._id, status);
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        res.status(200).json({ captain });
    } catch (error) {
        next(error);
    }
}

module.exports.getCaptainsInTheRadius = async (req, res, next) => {
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { ltd, lng, radius } = req.query;
        const captains = await captainService.getCaptainsInTheRadius(ltd, lng, radius);
        res.status(200).json(captains);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}






module.exports.waitForNewRide = async (req, res) => {
    
};

subscribeToQueue("new-ride-available", async (data) => {
    const ride = JSON.parse(data);
    console.log(ride);
    const response = await axios.get(`${process.env.BASE_URL}/maps/get-coordinates`, {
        params: {
            address: ride.pickup 
        }
    });
    const pickupCoordinates = response.data;
    const captainsInRadius = await captainService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, ride.vehicleType, 100);

    if (captainsInRadius.length === 0) {
        console.log('No captains in radius');
        return;
    }
    console.log(captainsInRadius);
    
    captainsInRadius.map(captain => {
        sendMessageToSocketId(captain.socketId, {
            event: 'new-ride',
            data: ride
        });
    });
});