const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const port = 3000;
const app = express();

// 1) MIDDLEWARES
// morgan is a middleware that logs the request data
app.use(morgan('dev'));

// middleware to parse the body of the request
// this middleware will add the data to the body property of the request object
// middleware is a function that can modify the incoming request data
// middleware because is in the middle of the request-response cycle
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next(); // call the next middleware in the stack
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // call the next middleware in the stack
});

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

// 2) ROUTE HANDLERS
// load the data once here: this is synchronous and will block the event loop
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// get all tours
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
  // :id is a URL parameter
  // we can use ? to make a parameter optional, i.e. /api/v1/tours/:id/:x?
  // req.params is an object that contains all the parameters that are in the URL
  console.log(req.params);

  // convert the id to a number
  const id = req.params.id * 1; // multiply by 1 to convert to a number

  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  //if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour, // we can use just tours as the key and value are the same
    },
  });
};

// create a new tour
const createTour = (req, res) => {
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
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// delete a tour
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// old routing system
/*
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/

// 3) ROUTES
// this will use the tourRouter middleware for all routes that start with /api/v1/tours
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// use a middleware to define the route
// this is called "mounting" the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START THE SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
