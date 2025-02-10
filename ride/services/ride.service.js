
const rideModel = require('../models/ride.model');
const axios = require('axios');
const crypto = require('crypto');


async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }
    try {
        const distanceTime = await axios.get(`${process.env.BASE_URL}/maps/get-distance-time?origin=${pickup}&destination=${destination}`);

        if (!distanceTime || !distanceTime.data || !distanceTime.data.distance || !distanceTime.data.duration) {
            throw new Error('Invalid response from distance-time API');
        }

        const baseFare = {
            auto: 30,
            car: 50,
            moto: 20
        };

        const perKmRate = {
            auto: 10,
            car: 15,
            moto: 8
        };

        const perMinuteRate = {
            auto: 2,
            car: 3,
            moto: 1.5
        };

        const fare = {
            auto: Math.round(baseFare.auto + ((distanceTime.data.distance.value / 1000) * perKmRate.auto) + ((distanceTime.data.duration.value / 60) * perMinuteRate.auto)),
            car: Math.round(baseFare.car + ((distanceTime.data.distance.value / 1000) * perKmRate.car) + ((distanceTime.data.duration.value / 60) * perMinuteRate.car)),
            moto: Math.round(baseFare.moto + ((distanceTime.data.distance.value / 1000) * perKmRate.moto) + ((distanceTime.data.duration.value / 60) * perMinuteRate.moto))
        };

        return { fare, distanceTime: distanceTime.data };

    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        throw new Error('Can not fetch distance and time');
    }
}

module.exports.getFare = getFare;


module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {

    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const { fare, distanceTime } = await getFare(pickup, destination);

    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType],
        vehicleType: vehicleType,
        duration: distanceTime.duration.value,
        distance: distanceTime.distance.value
    })

    return ride;
}

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}