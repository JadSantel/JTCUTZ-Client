const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const recipient = process.argv[2] || process.env.TEST_EMAIL_TO;

console.log('Checking Resend environment variables...');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Missing');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'Missing');
console.log('TEST_EMAIL_TO / argument:', recipient || 'Missing');
console.log('');

if (!recipient) {
  console.error('Usage: node test-email.js recipient@example.com');
  process.exit(1);
}

const { sendBookingConfirmation } = require('./utils/emailService');

sendBookingConfirmation({
  to: recipient,
  name: 'Test User',
  service: 'High Fade',
  date: new Date('2026-06-15'),
  time: '10:00 AM',
  notes: 'Test notes',
})
  .then(() => console.log('Email sent successfully.'))
  .catch((err) => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
