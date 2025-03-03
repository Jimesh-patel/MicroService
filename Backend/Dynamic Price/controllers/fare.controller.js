const axios = require("axios");
const { spawn } = require("child_process");

module.exports.getFare = async (req, res, next) => {
    const { pickup, destination } = req.body;

    try {
        const infoResponse = await axios.get(`${process.env.BASE_URL}/maps/traffic?origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`);
        const info = infoResponse.data;

        const baseFare = {
            auto: 2,
            car: 4,
            moto: 1
        };

        const RideData = {
            pickup,
            destination,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            distance: parseInt(info.distance),
            traffic: info.traffic_level,
            weather: info.weather
        };

        let fareResults = {};

        const calculateFare = (vehicleType) => {
            return new Promise((resolve, reject) => {
                const base_fare = baseFare[vehicleType] * RideData.distance;

                const args = [
                    "predict.py",
                    String(RideData.date),
                    String(RideData.time),
                    String(RideData.distance),
                    vehicleType,
                    String(base_fare),
                    String(RideData.traffic),
                    String(RideData.weather)
                ];

                const python = spawn("python", args);
                let result = "";

                python.stdout.on("data", (data) => {
                    result += data.toString();
                });

                python.stderr.on("data", (data) => {
                    console.error("Python Error:", data.toString());
                });

                python.on("close", (code) => {
                    resolve({ vehicleType, fare: parseFloat(result).toFixed(2) });
                });
            });
        };

        const farePromises = ["moto", "auto", "car"].map(calculateFare);

        Promise.all(farePromises)
            .then((results) => {
                results.forEach(({ vehicleType, fare }) => {
                    fareResults[vehicleType] = fare;
                });

                res.json(fareResults);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ Message: "Fare Calculation error..." });
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: "Fare Calculation error..." });
    }
};
