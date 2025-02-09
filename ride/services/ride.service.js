const rideModel = require('../models/ride.model');

async function getFare(pickup, destination, distanceTime) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    if (!distanceTime) {
        throw new Error('Distance and time are required');
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
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;

}

module.exports.getFare = getFare;


module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {

    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    // try {
    //     const distanceTime = await axios.get(`${process.env.BASE_URL}/maps/get-distance-time?origin=${pickup}&&destination=${destination}`)

    //     if(!distanceTime) {
    //         throw new Error('Can not fetch distance and time');
    //     }

    // } catch (error) {
    //     throw new Error('Can not fetch distance and time');
    // }

    // const fare = await getFare(pickup, destination, distanceTime);

    const ride = rideModel.create({
        user,
        pickup,
        destination,
        // otp: getOtp(6),
        otp: 123456,
        // fare: fare[vehicleType],
        fare: 100,
        vehicleType: vehicleType,
        // duration: distanceTime.duration.value,
        // distance: distanceTime.distance.value
        duration: 100,
        distance: 1000
    })

    return ride;
}
