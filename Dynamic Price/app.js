const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const cookieParser = require('cookie-parser');  
const cors = require('cors');
const priceRoutes = require('./routes/fare.route')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.get('/test', (req, res, next)=>{
    res.status(200).json("Dynamic Pricing working...");
    next()
})

app.use('/', priceRoutes)

module.exports = app;