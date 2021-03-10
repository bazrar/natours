const express = require('express');
const tourController = require('../controllers/tourController');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
  customMiddleware,
} = tourController;
const router = express.Router();

router.param('id', checkId);

//create checkbody middleware
//check for the name and price

//if not, send 404 error
//chain the middleware to the createTour
router.route('/').get(getAllTours).post(customMiddleware, createTour);
router.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

module.exports = router;
