const captainModel = require('../models/captain.model');


module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType }) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}


module.exports.changeCaptainStatus = async (captainId, status) => {
    const validStatuses = ['active', 'inactive', 'busy'];

    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
    }

    const captain = await captainModel.findByIdAndUpdate(captainId, { status }, { new: true });

    if (!captain) {
        throw new Error('Captain not found');
    }

    return captain;
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, vehicleType, radius) => {

    // radius in km

    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371]
            }
        },
        'vehicle.vehicleType': vehicleType,
        'status': 'active'
    });

    return captains;
}