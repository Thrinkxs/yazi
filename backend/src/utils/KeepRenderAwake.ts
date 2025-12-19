import axios from "axios";
import cron from "node-cron";
// import https from 'https';

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: true, // Enable SSL certificate validation
//   minVersion: 'TLSv1.2', // Force the minimum TLS version to 1.2
// });

export const KeepRenderAwake = () => {
  const pingURL = "https://yazi-r9qu.onrender.com";
  // const pingURL = 'http://localhost:3001';

  // Schedule the task to run every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    try {
      const response = await axios.get(pingURL);
      console.log(
        `Ping successful: ${response.status} - ${response.statusText}`
      );
    } catch (error: any) {
      if (error.response) {
        console.error(
          `Error pinging ${pingURL}: Status code ${error.response.status}`
        );
        console.error(`Response data: ${error.response.data}`);
      } else {
        console.error(`Error pinging ${pingURL}:`, error.message);
      }
    }
  });

  console.log("Cron job started. Pinging every 10 minutes.");
};
