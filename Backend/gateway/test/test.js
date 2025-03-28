const autocannon = require('autocannon');
const routes = require('./data'); 
const baseUrl = 'http://localhost:3000/'; 

async function runTests() {

  let TotalRequests = 0;

    const testPromises = routes.map(route => {
        return new Promise((resolve) => {
            const url = new URL(route.path, baseUrl).href;
            const params = {
                url,
                connections: 10, 
                duration: 10, 
                method: route.method,
                headers: {}
            };

            if (route.authToken) {
                params.headers['Authorization'] = `Bearer ${route.authToken}`;
            }
            
            if (route.body) {
                params.body = JSON.stringify(route.body);
                params.headers['Content-Type'] = 'application/json';
            }
            
            if (route.query) {
                const queryString = new URLSearchParams(route.query).toString();
                params.url += `?${queryString}`;
            }

            autocannon(params, (err, result) => {
                if (err) {
                    console.error(`Error testing ${route.path}:`, err);
                } else {
                    console.log(`\nURL : ${url}`);
                    console.log(`Total Requests: ${result.requests.total}`);
                    TotalRequests += result.requests.total;
                    console.log(`Duration: ${result.duration} sec`);
                    console.log("-------------------------------------------------------------------");

                }
                resolve();
            });
        });
    });

    await Promise.all(testPromises);
    console.log('All tests completed.');
    console.log('Total Number of Requests : ', TotalRequests);
}

runTests();
