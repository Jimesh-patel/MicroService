const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const { initializeSocket } = require('./socket');

dotenv.config();

const port = process.env.PORT || 3003;
const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log(`Ride Server is running on port ${port}`);
});