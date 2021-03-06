// run this file to test the api

// i should probably create a mock app
// TODO: create a mock app instead of dealing with the actual process
// make configuration for local env file for this test -> fall back to main env

const pm2 = require(`pm2`);
require(`dotenv`).config({ path: `.env` });

const {
  PROCESS_NAME:NAME,
} = process.env;

pm2.connect((e) => {
  if (e) {
    console.error(e);
    process.exit(2);
  }

  pm2.restart(NAME, (err, proc) => {
    console.log(`restarting ${NAME}... waiting 10 seconds for it to restart`);
    setTimeout(() => {
      pm2.describe(NAME, (e, d) => {
        if (e) {
          console.error(e);
          return;
        }
        console.log(`there are ${d.length} processes. selecting the first one`);
        d = d[0];
        console.log(
          `status:${
            d.pm2_env.status
          }\ncpu usage: ${
            d.monit.cpu
          }\nmemory usage:${
            d.monit.memory
          }`);
        pm2.disconnect();
      });
    }, 10 * 1000);
  });
});