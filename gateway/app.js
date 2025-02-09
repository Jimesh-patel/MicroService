const express = require('express');
const expressProxy = require('express-http-proxy');

const app = express();

app.use('/users', expressProxy('http://localhost:3001'));
app.use('/captains', expressProxy('http://localhost:3002'));
app.use('/rides', expressProxy('http://localhost:3003'));
app.use('/maps', expressProxy('http://localhost:3004'));

app.listen(3000, () => {
  console.log('Gateway listening on port 3000');
});
