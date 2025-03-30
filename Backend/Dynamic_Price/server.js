const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PRICE_PORT || 3005;
const server = http.createServer(app);


server.listen(port, () => {
    console.log(`🚀 Pricing service running on port ${port}`);
});