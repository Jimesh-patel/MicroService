const express = require('express');
const expressProxy = require('express-http-proxy');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client'); 

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

app.use('/users', expressProxy('http://localhost:3001'));
app.use('/captains', expressProxy('http://localhost:3002'));
app.use('/rides', expressProxy('http://localhost:3003'));
app.use('/maps', expressProxy('http://localhost:3004'));
app.use('/price', expressProxy('http://localhost:3005'));
app.use('/payment', expressProxy('http://localhost:3006'));

const captainSocket = Client('http://localhost:3002');
const userSocket = Client('http://localhost:3001');

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', (data) => {
        if (data.userType === 'captain') {
            captainSocket.emit('join', data); 
        } else if(data.userType === 'user') {
            userSocket.emit('join', data);
        }
    });

    socket.on('update-location-captain', (data) => {
        captainSocket.emit('update-location-captain', data);
    }); 

    captainSocket.on('new-ride', (data) => {
        console.log('New ride event received in gateway' + data);
        socket.emit('new-ride', data);
    });

    socket.on('no-captains', (data) =>{
        io.emit('no-captains', data);
    });

    captainSocket.on('ride-confirmed', (data) => { 
        socket.emit('ride-confirmed', data);
    });
    
    socket.on('ride-started', (data) =>{
        io.emit('ride-started', data);
    });

    socket.on('ride-ended', (data)=>{
        io.emit("ride-ended", data);
    })

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});


server.listen(3000, () => {
    console.log('Gateway listening on port 3000');
});