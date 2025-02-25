const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get('/', (req, res) => {
    res.send('Welcome to GoCab Payment Service');
});


app.post("/create-order", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency,
            payment_capture: 1
        });

        return res.json({ orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to create order" });
    }
});


app.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, driverId } = req.body;

        const crypto = require("crypto");
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        const platformAmount = (amount * 10) / 100;
        const driverAmount = (amount * 90) / 100;

        const transferResponse = await razorpay.payments.transfer(razorpay_payment_id, {
            transfers: [
                {
                    account: driverId, 
                    amount: driverAmount * 100,
                    currency: "INR",
                    notes: { ride: "GoCab Ride Payment" }
                }
            ]
        });

        res.json({ success: true, message: "Payment distributed", transferResponse });
    } catch (error) {
        res.status(500).json({ error: "Payment verification failed" });
    }
});


module.exports = app;