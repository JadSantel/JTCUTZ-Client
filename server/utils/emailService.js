const nodemailer = require('nodemailer');

// ── Transporter ──────────────────────────────────────────────────────────────
const createTransporter = () => {
  // Validate required env vars
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email config error:');
    console.error('   EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
    console.error('   EMAIL_PASS:', process.env.EMAIL_PASS ? '(hidden, length: ' + process.env.EMAIL_PASS.length + ')' : 'NOT SET');
    throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
  }
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
};

// ── Shared HTML layout wrapper ────────────────────────────────────────────────
const htmlLayout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>JT CUTZ</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;border-bottom:3px solid #eb5328;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:4px;color:#666;text-transform:uppercase;">Premium Barbershop</p>
              <h1 style="margin:0;font-size:42px;font-weight:900;color:#f5f5f5;letter-spacing:8px;text-transform:uppercase;font-family:Georgia,serif;">JT CUTZ</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#111;padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1a1a;border-top:1px solid #2a2a2a;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#444;letter-spacing:2px;text-transform:uppercase;">JT CUTZ Barbershop</p>
              <p style="margin:0;font-size:11px;color:#444;">This is an automated message — please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ── Detail row helper ─────────────────────────────────────────────────────────
const detailRow = (label, value) => `
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;">
      <p style="margin:0 0 2px 0;font-size:10px;letter-spacing:3px;color:#666;text-transform:uppercase;">${label}</p>
      <p style="margin:0;font-size:15px;color:#f5f5f5;font-weight:500;">${value}</p>
    </td>
  </tr>`;

// ── Send booking confirmation email ───────────────────────────────────────────
const sendBookingConfirmation = async ({ to, name, service, date, time, notes }) => {
  try {
    const transporter = createTransporter();

    const formattedDate = new Date(date).toLocaleDateString('en-PH', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const notesRow = notes
      ? detailRow('Your Notes', `<em style="color:#888;">"${notes}"</em>`)
      : '';

    const content = `
      <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:3px;color:#eb5328;text-transform:uppercase;">Appointment Confirmed</p>
      <h2 style="margin:0 0 8px 0;font-size:28px;font-weight:800;color:#f5f5f5;letter-spacing:2px;text-transform:uppercase;">You're all set, ${name.split(' ')[0]}!</h2>
      <p style="margin:0 0 32px 0;font-size:14px;color:#888;line-height:1.6;">Your appointment at JT CUTZ has been confirmed. We'll see you soon — come fresh, leave fresh.</p>

      <!-- Appointment details table -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-left:3px solid #eb5328;margin-bottom:32px;">
        <tbody>
          ${detailRow('Service', service)}
          ${detailRow('Date', formattedDate)}
          ${detailRow('Time', time)}
          ${notesRow}
        </tbody>
      </table>

      <!-- Reminder box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;margin-bottom:32px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:2px;color:#eb5328;text-transform:uppercase;">Reminders</p>
            <p style="margin:0 0 4px 0;font-size:13px;color:#888;line-height:1.6;">· Arrive 5 minutes before your scheduled time</p>
            <p style="margin:0 0 4px 0;font-size:13px;color:#888;line-height:1.6;">· To cancel, log in to your account dashboard</p>
            <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">· Walk-ins are subject to availability</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:#555;line-height:1.6;text-align:center;">
        Need to make changes? Log in to your account at <span style="color:#eb5328;">JT CUTZ</span> and manage your appointments from your dashboard.
      </p>`;

    const result = await transporter.sendMail({
      from:    `"JT CUTZ Barbershop" <${process.env.EMAIL_USER}>`,
      to,
      subject: `✂️ Appointment Confirmed — ${service} on ${formattedDate}`,
      html:    htmlLayout(content),
    });

    console.log(`✅ Booking confirmation email sent to ${to}`, { messageId: result.messageId });
    return result;
  } catch (error) {
    console.error(`❌ Failed to send booking confirmation email to ${to}:`, error.message);
    throw error; // Re-throw to handle in controller
  }
};

// ── Send cancellation email ───────────────────────────────────────────────────
const sendCancellationEmail = async ({ to, name, service, date, time }) => {
  try {
    const transporter = createTransporter();

    const formattedDate = new Date(date).toLocaleDateString('en-PH', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const content = `
      <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:3px;color:#ef4444;text-transform:uppercase;">Appointment Cancelled</p>
      <h2 style="margin:0 0 8px 0;font-size:28px;font-weight:800;color:#f5f5f5;letter-spacing:2px;text-transform:uppercase;">Your appointment has been cancelled</h2>
      <p style="margin:0 0 32px 0;font-size:14px;color:#888;line-height:1.6;">Hi ${name.split(' ')[0]}, the following appointment has been cancelled. We hope to see you again soon.</p>

      <!-- Cancelled appointment details -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-left:3px solid #ef4444;margin-bottom:32px;">
        <tbody>
          ${detailRow('Service', service)}
          ${detailRow('Date', formattedDate)}
          ${detailRow('Time', time)}
          ${detailRow('Status', '<span style="color:#ef4444;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Cancelled</span>')}
        </tbody>
      </table>

      <!-- Rebook CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;margin-bottom:32px;">
        <tr>
          <td style="padding:24px;text-align:center;">
            <p style="margin:0 0 12px 0;font-size:14px;color:#888;">Want to book a new appointment?</p>
            <p style="margin:0;font-size:13px;color:#555;">Log in to your JT CUTZ dashboard and book a new slot at any time.</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:#555;line-height:1.6;text-align:center;">
        If you didn't cancel this appointment, please contact us as soon as possible.
      </p>`;

    const result = await transporter.sendMail({
      from:    `"JT CUTZ Barbershop" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Appointment Cancelled — ${service} on ${formattedDate}`,
      html:    htmlLayout(content),
    });

    console.log(`✅ Cancellation email sent to ${to}`, { messageId: result.messageId });
    return result;
  } catch (error) {
    console.error(`❌ Failed to send cancellation email to ${to}:`, error.message);
    throw error; // Re-throw to handle in controller
  }
};

module.exports = { sendBookingConfirmation, sendCancellationEmail };
