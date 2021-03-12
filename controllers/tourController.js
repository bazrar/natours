const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save()
  try {
    // console.log(req.body);
    const newTour = await Tour.create(req.body);
    // console.log(newTour);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    // DELETE FOLLOWING PROP FROM queryObj
    excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(req.params);
    // console.log(req.query);
    // console.log(typeof queryObj);

    // console.log(typeof queryStr + queryStr);

    // ADVANCED FILTER
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      // console.log(match);
      return `$${match}`;
    });
    // console.log(queryStr);

    // const tours = await Tour.find()
    //   .where('duration')
    //   .lte(5)
    //   .where('difficulty')
    //   .equals('easy');
    // console.log(tours);

    // returns query obj
    let query = Tour.find(JSON.parse(queryStr));

    console.log(query);
    // 2 SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // query = query.sort(req.query.sort);
    } else {
      query = query.sort('-createdAt');
    }

    //3 FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4 PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments;
      if (skip >= numTours) throw new Error('page limit exceeded');
    }
    // EXECUTE QUERY
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.find({ _id: { $eq: req.params.id } });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndRemove(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
// const fs = require('fs');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// exports.getTour = (req, res) => {
//   const { id } = req.params;
//   //   console.log(typeof id, id);

//   const tour = tours.find((tour) => tour.id === parseInt(id));
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// exports.createTour = (req, res) => {
//   //   console.log(req.body);
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       if (err) console.log(err);
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
//   //   res.send('done');
// };

// exports.updateTour = (req, res) => {
//   //   console.log(req.body);
//   const { name, duration, difficulty } = req.body;
//   const { id } = req.params;
//   const tour = tours.find((tour) => tour.id === parseInt(id));
//   //   console.log(name, duration, difficulty);

//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   const newTour = { ...tour, name, duration, difficulty };
//   //   console.log(newTour);
//   tours[parseInt(id)] = newTour;

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// exports.deleteTour = (req, res) => {
//   //   console.log(req.body);
//   const { id } = req.params;
//   //   console.log(id);
//   const tour = tours.filter((tour) => tour.id !== parseInt(id));
//   console.log(name, duration, difficulty);

//   if (req.params.id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   console.log(tour);
//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tour),
//     (err) => {
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour: null,
//         },
//       });
//     }
//   );
// };

// exports.checkId = (req, res, next, val) => {
//   const tour = tours.find((tour) => tour.id === parseInt(val));
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   next();
// };

// exports.customMiddleware = (req, res, next) => {
//   const { name, price } = req.body;
//   if (!(name && price)) {
//     return res.status(404).json({
//       status: 'error',
//       message: '404 error',
//     });
//   }
//   next();
// };
