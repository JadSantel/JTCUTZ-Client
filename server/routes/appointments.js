const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAvailableSlots,
  getMyAppointments,
  getAllAppointments,
  completeAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');

// Slot availability (must come before /:id routes)
router.get('/slots',          protect,             getAvailableSlots);

// User routes
router.post('/',              protect,             createAppointment);
router.get('/my',             protect,             getMyAppointments);
router.patch('/:id/cancel',   protect,             cancelAppointment);
router.patch('/:id/complete', protect, adminOnly,  completeAppointment);

// Admin routes
router.get('/all',            protect, adminOnly,  getAllAppointments);

module.exports = router;
