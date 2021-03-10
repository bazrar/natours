const express = require('express');
const tourController = require('../controllers/tourController');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
} = tourController;
const router = express.Router();

router.param('id', checkId);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

module.exports = router;
