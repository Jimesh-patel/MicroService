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
            return new Promise((resolve) => {
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
                    console.error(`Python Error (${vehicleType}):`, data.toString());
                });

                python.on("close", (code) => {
                    if (result && !isNaN(result)) {
                        resolve({ vehicleType, fare: parseFloat(result).toFixed(2) });
                    } else {
                        // Fallback static fare calculation if Python script fails
                        console.error(`Fallback to static fare for ${vehicleType}`);
                        const staticFare = (baseFare[vehicleType] * RideData.distance * 1.2).toFixed(2);
                        resolve({ vehicleType, fare: staticFare });
                    }
                });

                // Timeout for Python script (failsafe)
                setTimeout(() => {
                    console.error(`Python script timeout for ${vehicleType}`);
                    const staticFare = (baseFare[vehicleType] * RideData.distance * 1.2).toFixed(2);
                    resolve({ vehicleType, fare: staticFare });
                }, 5000); // 5 seconds timeout
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
                console.error("Fare Calculation Error:", error);
                res.status(500).json({ Message: "Fare Calculation error..." });
            });

    } catch (error) {
        console.error("API Fetch Error:", error);
        res.status(500).json({ Message: error.message });
    }
};
