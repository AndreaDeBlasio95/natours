const app = require('./app');

// 4) START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});