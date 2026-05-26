const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Temporary fix for SSL certificate issues in dev environment
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const { sendBookingConfirmation } = require('./utils/emailService');

console.log('🔍 Checking environment variables...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
console.log('');

sendBookingConfirmation({
  to: 'youremail@gmail.com',
  name: 'Test User',
  service: 'High Fade',
  date: new Date('2026-06-15'),
  time: '10:00 AM',
  notes: 'Test notes',
})
  .then(() => console.log('✅ Email sent successfully!'))
  .catch(err => console.error('❌ Failed:', err.message));
