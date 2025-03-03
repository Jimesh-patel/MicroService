const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const captainRoutes = require('../captain/routes/captain.route');
const cookieParser = require('cookie-parser');  
const connectDB = require('../captain/db/db');
const RabbitMQ = require('../captain/services/rabbitmq')
const cors = require('cors');
app.use(cors());

connectDB();
RabbitMQ.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/', captainRoutes)

module.exports = app;