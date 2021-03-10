const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const { id } = req.params;
  //   console.log(typeof id, id);

  const tour = tours.find((tour) => tour.id === parseInt(id));
  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'invalid id',
  //     });
  //   }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.log(err);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  //   res.send('done');
};

exports.updateTour = (req, res) => {
  //   console.log(req.body);
  const { name, duration, difficulty } = req.body;
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === parseInt(id));
  //   console.log(name, duration, difficulty);

  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'invalid id',
  //     });
  //   }
  const newTour = { ...tour, name, duration, difficulty };
  //   console.log(newTour);
  tours[parseInt(id)] = newTour;

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  //   console.log(req.body);
  const { id } = req.params;
  //   console.log(id);
  const tour = tours.filter((tour) => tour.id !== parseInt(id));
  //   console.log(name, duration, difficulty);

  //   if (req.params.id > tours.length) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'invalid id',
  //     });
  //   }
  console.log(tour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tour),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: null,
        },
      });
    }
  );
};

exports.checkId = (req, res, next, val) => {
  const tour = tours.find((tour) => tour.id === parseInt(val));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  next();
};

exports.customMiddleware = (req, res, next) => {
  const { name, price } = req.body;
  if (!(name && price)) {
    return res.status(404).json({
      status: 'error',
      message: '404 error',
    });
  }
  next();
};
