const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  // console.log('test completed');
  app.use(morgan('dev'));
}
// console.log(process.env);

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// ############ custom middleware adds request time to the request obj ############
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// app.get('/',(req, res) => {
//     res.status(200).json({message: 'hello from the serverside!'})

// })

// app.post('/', (req,res) => {
//     res.send('you can post to this endpoint')
// })

// const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`);

// ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.put('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can't find ${req.url} on the server`,
  });
  next();
});
// START THE SERVER AT PORT 3000

module.exports = app;
