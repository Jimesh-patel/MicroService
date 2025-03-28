const express = require('express');
const expressProxy = require('express-http-proxy');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const server = createServer(app);


app.use(cors());

app.use('/users', expressProxy('http://localhost:3001'));
app.use('/captains', expressProxy('http://localhost:3002'));
app.use('/rides', expressProxy('http://localhost:3003'));
app.use('/maps', expressProxy('http://localhost:3004'));
app.use('/price', expressProxy('http://localhost:3005'));
app.use('/payment', expressProxy('http://localhost:3006'));


server.listen(3000, () => {
    console.log('Gateway listening on port 3000');
});