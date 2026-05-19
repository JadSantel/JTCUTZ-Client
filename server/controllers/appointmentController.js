const Appointment = require('../models/Appointment');
const { sendBookingConfirmation, sendCancellationEmail } = require('../utils/emailService');

// Allowed time slots — single source of truth (mirrors frontend)
const TIME_SLOTS = [
  '9:00 AM',  '9:30 AM',  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM',  '1:30 PM',
  '2:00 PM',  '2:30 PM',  '3:00 PM',  '3:30 PM',
  '4:00 PM',  '4:30 PM',  '5:00 PM',
];

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  const { service, date, time, notes } = req.body;

  if (!service || !date || !time) {
    return res.status(400).json({ success: false, message: 'Service, date, and time are required' });
  }

  if (!TIME_SLOTS.includes(time)) {
    return res.status(400).json({ success: false, message: 'Invalid time slot' });
  }

  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate)) {
    return res.status(400).json({ success: false, message: 'Invalid date' });
  }

  // Prevent past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    return res.status(400).json({ success: false, message: 'Cannot book appointments in the past' });
  }

  try {
    // Check for double booking — same date + time slot already taken (upcoming only)
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      date:   { $gte: startOfDay, $lte: endOfDay },
      time,
      status: 'upcoming',
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time.',
      });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      service,
      date:   appointmentDate,
      time,
      notes:  notes || '',
    });

    // Send confirmation email — fire and forget (don't block response)
    sendBookingConfirmation({
      to:      req.user.email,
      name:    req.user.name,
      service,
      date:    appointmentDate,
      time,
      notes:   notes || '',
    })
      .then(async () => {
        appointment.emailSent = true;
        await appointment.save();
      })
      .catch((err) => {
        console.error('❌ Booking email failed:', err.message);
        // Email failure won't block appointment creation, but we log it
      });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error('createAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get taken time slots for a given date
// @route   GET /api/appointments/slots?date=YYYY-MM-DD
// @access  Private
const getAvailableSlots = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date query param required' });
  }

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      date:   { $gte: startOfDay, $lte: endOfDay },
      status: 'upcoming',
    }).select('time');

    const takenSlots = booked.map((a) => a.time);

    res.json({ success: true, takenSlots });
  } catch (error) {
    console.error('getAvailableSlots error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get logged-in user's appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ date: -1, createdAt: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('getMyAppointments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all appointments (admin only)
// @route   GET /api/appointments/all
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email phone')
      .sort({ date: -1, createdAt: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('getAllAppointments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (owner or admin)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Only the owner or admin can cancel
    const isOwner = appointment.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Send cancellation email — fire and forget
    const populatedAppointment = await Appointment.findById(appointment._id).populate('userId', 'name email');
    if (populatedAppointment?.userId) {
      sendCancellationEmail({
        to:      populatedAppointment.userId.email,
        name:    populatedAppointment.userId.name,
        service: appointment.service,
        date:    appointment.date,
        time:    appointment.time,
      }).catch((err) => {
        console.error('❌ Cancellation email failed:', err.message);
        // Email failure won't block cancellation, but we log it
      });
    }

    res.json({ success: true, message: 'Appointment cancelled', appointment });
  } catch (error) {
    console.error('cancelAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getAvailableSlots,
  getMyAppointments,
  getAllAppointments,
  cancelAppointment,
};
