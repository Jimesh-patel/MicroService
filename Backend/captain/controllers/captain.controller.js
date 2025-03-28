const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');
const axios = require('axios');
const { subscribeToQueue, publishToQueue } = require('../services/rabbitmq');
const { sendMessageToSocketId } = require('../socket');

const crypto = require('crypto');
const twilio = require('twilio');
const bcrypt = require('bcrypt');

const otpStore = new Map();  
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


function getOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}



module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { fullname, email, password, vehicle, paymentId, phone } = req.body;

        const isCaptainAlreadyExist = await captainModel.findOne({ email });

        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exist, Please login...' });
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
            vehicleType: vehicle.vehicleType,
            paymentId,
            phone
        });

        const token = captain.generateAuthToken();

        res.status(201).json({ token, captain });
    } catch (error) {
        return res.status(401).json({ message: 'Registration Failed !' });
    }
}

module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({ message: 'User not exist, Please signup...' });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = captain.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, captain });

    } catch (error) {
        return res.status(400).json({ message: 'Login Failed !' });
    }
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

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
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getCaptainById = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.query;

        const captain = await captainService.getCaptainById(id);
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        res.status(200).json({ captain });
    } catch (error) {
        next(error);
    }
}


subscribeToQueue("new-ride-available", async (data) => {
    console.log('New ride available');
    const ride = JSON.parse(data);
    const response = await axios.get(`${process.env.BASE_URL}/maps/get-coordinates`, {
        params: {
            address: ride.pickup
        }
    });
    const pickupCoordinates = response.data;
    const captainsInRadius = await captainService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, ride.vehicleType, 100);
    
    if (captainsInRadius.length === 0) {
        // gatewaySocket.emit('no-captains', ride);
        console.log('No captains in radius');
        await publishToQueue('no-captain', JSON.stringify(ride));
        return;
    }
    console.log('Captains in radius:', captainsInRadius);
    captainsInRadius.map(captain => {
        sendMessageToSocketId(captain.socketId, {
            event: 'new-ride',
            data: ride
        });
    });
});

module.exports.confirmRide = async (req, res, next) => {
    var { ride } = req.body;
    const token = req.headers.authorization.split(' ')[1] || req.cookies.token;

    if (!ride) {
        return res.status(400).json({ message: 'Ride is required' });
    }

    if(ride.status !== 'pending') {
        return res.status(400).json({ message: 'You are late, Ride is already accepted' });
    }

    try {
        const response = await axios.put(
            `${process.env.BASE_URL}/rides/change-status`,
            { rideId: ride._id, status: 'accepted', captainId: req.captain._id },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        captainService.changeCaptainStatus(req.captain._id, 'busy');

        ride.status = response.data.status;
        ride.otp = response.data.otp;
        const phone = ride.user.phone;

        await client.messages.create({
            body: `Your OTP is: ${ride.otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        ride = {
            ...ride,
            captain: req.captain
        }

        await publishToQueue('ride-confirmed', JSON.stringify(ride));

        if (!response.data) {
            return res.status(500).json({ message: 'Ride not found' });
        }

        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Can not confirm ride' });
    }
};



module.exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const otp = getOtp(6);
        const hashedOtp = await bcrypt.hash(otp, 10);

        otpStore.set(phone, { otp: hashedOtp, expiresAt: Date.now() + 300000 });

        await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};


module.exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone and OTP are required" });
        }

        const storedOtpData = otpStore.get(phone);
        if (!storedOtpData || Date.now() > storedOtpData.expiresAt) {
            otpStore.delete(phone); 
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        const isOtpValid = await bcrypt.compare(otp, storedOtpData.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        otpStore.delete(phone); 
        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        res.status(500).json({ message: "OTP verification failed", error: error.message });
    }
};

module.exports.resendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const existingOtp = otpStore.get(phone);
        if (existingOtp && Date.now() < existingOtp.expiresAt) {
            otpStore.delete(phone);
        }

        const newOtp = getOtp(6);
        const hashedOtp = await bcrypt.hash(newOtp, 10);

        otpStore.set(phone, { otp: hashedOtp, expiresAt: Date.now() + 300000 });

        await client.messages.create({
            body: `Your new OTP is: ${newOtp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        res.status(200).json({ message: "New OTP sent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to resend OTP", error: error.message });
    }
};





