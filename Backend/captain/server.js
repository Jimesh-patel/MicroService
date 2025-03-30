const http = require('http');
const app = require('./app'); 
const { initializeSocket } = require('./socket');  

const port = process.env.CAPTAIN_PORT || 3002;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, ()=> {
    console.log(`Captain Server is running on port ${port}`);
});