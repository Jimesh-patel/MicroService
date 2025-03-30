require('dotenv').config();

const express = require('express');
const expressProxy = require('express-http-proxy');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

app.use(cors());

app.use('/users', expressProxy(process.env.USER_SERVICE_URL));
app.use('/captains', expressProxy(process.env.CAPTAIN_SERVICE_URL));
app.use('/rides', expressProxy(process.env.RIDE_SERVICE_URL));
app.use('/maps', expressProxy(process.env.MAP_SERVICE_URL));
app.use('/price', expressProxy(process.env.PRICE_SERVICE_URL));
app.use('/payment', expressProxy(process.env.PAYMENT_SERVICE_URL));

const PORT = process.env.GATEWAY_PORT || 3000;

server.listen(PORT, () => {
    console.log(`Gateway listening on port ${PORT}`);
});
