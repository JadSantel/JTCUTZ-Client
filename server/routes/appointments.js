const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAvailableSlots,
  getMyAppointments,
  getAllAppointments,
  cancelAppointment,
} = require('../controllers/appointmentController');

// Slot availability (must come before /:id routes)
router.get('/slots',          protect,             getAvailableSlots);

// User routes
router.post('/',              protect,             createAppointment);
router.get('/my',             protect,             getMyAppointments);
router.patch('/:id/cancel',   protect,             cancelAppointment);

// Admin routes
router.get('/all',            protect, adminOnly,  getAllAppointments);

module.exports = router;