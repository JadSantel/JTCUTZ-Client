/**
 * Email Configuration Diagnostic Tool
 * Run this to verify your email setup is correct
 */

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║  JT CUTZ Email Configuration Diagnostic               ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Step 1: Check if .env file exists and is being loaded
console.log('📋 Step 1: Loading environment variables...');
require('dotenv').config({ path: './.env' });

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER) {
  console.error('❌ EMAIL_USER is not set in .env file');
  process.exit(1);
}

if (!EMAIL_PASS) {
  console.error('❌ EMAIL_PASS is not set in .env file');
  process.exit(1);
}

console.log(`✅ EMAIL_USER: ${EMAIL_USER}`);
console.log(`✅ EMAIL_PASS: ${EMAIL_PASS.length} characters loaded`);
console.log(`✅ Full password: ${EMAIL_PASS}\n`);

// Step 2: Test nodemailer transporter
console.log('📧 Step 2: Creating Nodemailer transporter...');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

console.log('✅ Transporter created successfully\n');

// Step 3: Verify connection
console.log('🔗 Step 3: Verifying SMTP connection...');
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP verification failed:');
    console.error('   Error:', error.message);
    console.error('\n💡 Common issues:');
    console.error('   • Incorrect Gmail app password');
    console.error('   • Account has 2FA but app password not generated');
    console.error('   • Less secure apps not enabled (if not using app password)');
    console.error('   • Password contains special characters (try regenerating)');
    process.exit(1);
  }
  if (success) {
    console.log('✅ SMTP connection verified successfully!\n');
    console.log('🎉 Your email configuration is working correctly!');
    console.log('   You should now receive appointment confirmation emails.\n');
    process.exit(0);
  }
});
