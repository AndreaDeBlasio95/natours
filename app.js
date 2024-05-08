const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// define the route
// get is the HTTP method, '/' is the path, and the function is the route handler
/*
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.status(200).send('You can post to this endpoint...');
});
*/

// load the data once here: this is synchronous and will block the event loop
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours, // we can use just tours as the key and value are the same
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
