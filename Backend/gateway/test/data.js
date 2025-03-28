const autocannon = require('autocannon');
const captainToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2M3NGY1NzZlYjA2ZThlYmM4ZWI1YjQiLCJpYXQiOjE3NDE0NjAzODcsImV4cCI6MTc0MTU0Njc4N30.GSe1TeAMoLOXEsB8PBI8_V3wlRb2FZuMvv5IYQ-vwUg';
const useToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2M3NGVmZmYwYjZkYWZmYzQ3ZmI5NTEiLCJpYXQiOjE3NDE0NTM5MTksImV4cCI6MTc0MTU0MDMxOX0.8M06XMLfQQrMhSV7jZ0n7UlSWHxxSnZct2TaF9kd2m8';
const routes = [
    // user api
    {
        method: 'POST',
        path: 'users/login',
        body: {
            email: 'testuser@gmail.com',
            password: '1235456'
        }
    },
    {
        method: 'GET',
        path: 'users/profile',
        authToken: useToken
    },
    {
        method: 'GET',
        path: 'users/user',
        query: { userId: '67c74efff0b6daffc47fb951' }
    },
    // captain api
    {
        method: 'POST',
        path: 'captains/login',
        body: {
            email: 'testdriver@gmail.com',
            password: '123456'
        }
    },
    {
        method: 'GET',
        path: 'captains/profile',
        authToken: captainToken
    },
    {
        method: 'PATCH',
        path: 'captains/status',
        authToken: captainToken,
        body: { status: 'active' }
    },
    {
        method: 'GET',
        path: 'captains/get-captains-in-radius',
        query: { ltd: 40.7128, lng: -74.0060, radius: 10, vehicleType: "moto" },
        authToken: captainToken
    },
    {
        method: 'GET',
        path: 'captains/get-CaptainById',
        query: { id: '67c74f576eb06e8ebc8eb5b4' }
    },
    // ride api
    {
        method: 'PUT',
        path: 'rides/change-status',
        authToken: captainToken,
        body: {
            rideId: "67c8928781a00d9f858ac2a1",
            status: "accepted",
            captainId: "67c74f576eb06e8ebc8eb5b4"
          }
    },
    {
        method: 'GET',
        path: 'rides/get-user-rides',
        authToken: useToken
    },
    {
        method: 'GET',
        path: 'rides/get-captain-rides',
        authToken: captainToken
    }
];

module.exports = routes;

