const axios = require('axios');

const URL = 'http://localhost:8000/countries';
const N_REQUESTS = 65; // Exceed the 60/minute limit

(async () => {
  console.log(`Sending ${N_REQUESTS} requests to ${URL}...`);
  for (let i = 0; i < N_REQUESTS; i++) {
    try {
      const resp = await axios.get(URL);
      console.log(`Request ${i + 1}: status=${resp.status}`);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.log('Rate limit exceeded! Response:', err.response.data);
        break;
      } else {
        console.error(`Request ${i + 1}: error`, err.message);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5s between requests
  }
  console.log('Done.');
})();
