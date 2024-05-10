const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const port = 3000;
const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next(); // call the next middleware in the stack
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // call the next middleware in the stack
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START THE SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
