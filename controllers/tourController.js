const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// middleware to check if the ID is valid
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    // the return is important to continue the code execution after the middleware, otherwise it will stop here
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next(); // this is important to move to the next middleware
};

// get all tours
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours, // we can use just tours as the key and value are the same
    },
  });
};

// get a single tour
exports.getTour = (req, res) => {
  // :id is a URL parameter
  // we can use ? to make a parameter optional, i.e. /api/v1/tours/:id/:x?
  // req.params is an object that contains all the parameters that are in the URL
  console.log(req.params);

  // convert the id to a number
  const id = req.params.id * 1; // multiply by 1 to convert to a number

  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  res.status(200).json({
    status: 'success',
    data: {
      tour, // we can use just tours as the key and value are the same
    },
  });
};

// create a new tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // merge the new id with the body of the request, which contains the new tour data.

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// update a tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// delete a tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
