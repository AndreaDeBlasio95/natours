const dotenv = require('dotenv');
// Load env vars: read the .env file and assign the values to process.env
dotenv.config({ path: './config.env' });

const app = require('./app');

console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
