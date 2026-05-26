/**
 * Resend email configuration diagnostic tool.
 *
 * Usage:
 *   node diagnose-email.js recipient@example.com
 */

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const recipient = process.argv[2] || process.env.TEST_EMAIL_TO;
const checks = [
  ['RESEND_API_KEY', Boolean(process.env.RESEND_API_KEY)],
  ['RESEND_FROM_EMAIL', Boolean(process.env.RESEND_FROM_EMAIL)],
  ['recipient argument or TEST_EMAIL_TO', Boolean(recipient)],
];

console.log('JT CUTZ Resend Email Diagnostic');
console.log('--------------------------------');

checks.forEach(([label, passed]) => {
  console.log(`${passed ? 'OK' : 'MISSING'} ${label}`);
});

if (process.env.RESEND_FROM_EMAIL) {
  console.log(`From sender: ${process.env.RESEND_FROM_EMAIL}`);
}

if (!checks.every(([, passed]) => passed)) {
  console.error('\nMissing required email configuration.');
  console.error('Set RESEND_FROM_EMAIL to an address on your verified Resend domain, such as:');
  console.error('JT CUTZ <bookings@yourdomain.com>');
  process.exit(1);
}

const { sendBookingConfirmation } = require('./utils/emailService');

sendBookingConfirmation({
  to: recipient,
  name: 'Diagnostic User',
  service: 'High Fade',
  date: new Date('2026-06-15'),
  time: '10:00 AM',
  notes: 'Resend diagnostic email',
})
  .then(() => {
    console.log('\nDiagnostic email sent successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nDiagnostic email failed:');
    console.error(error.message);
    process.exit(1);
  });
