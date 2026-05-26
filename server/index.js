const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const galleryRoutes = require('./routes/gallery');
const { completePastAppointments } = require('./controllers/appointmentController');

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'RESEND_API_KEY'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

if (process.env.CLIENT_URL) {
  const envOrigins = process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''));
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin);
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/gallery', galleryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'JT CUTZ API is running' });
});

const PORT = process.env.PORT || 5000;
const AUTO_COMPLETE_INTERVAL_MS = 5 * 60 * 1000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    completePastAppointments().catch((err) => {
      console.error('Auto-complete appointments failed:', err.message);
    });
    setInterval(() => {
      completePastAppointments().catch((err) => {
        console.error('Auto-complete appointments failed:', err.message);
      });
    }, AUTO_COMPLETE_INTERVAL_MS);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
