# 🚀 Quick Start Guide — JT CUTZ

Get the JT CUTZ booking system up and running in 5 minutes!

---

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **MongoDB Atlas** account (free tier available)
- **Gmail account** for email notifications
- **Git** for version control

---

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/jtcutz.git
cd jtcutz
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# - MONGO_URI: Your MongoDB connection string
# - JWT_SECRET: Any random string (for production, use a strong key)
# - EMAIL_USER: Your Gmail address
# - EMAIL_PASS: Gmail app password
# - ADMIN_EMAIL: Admin account email (e.g., admin@jtcutz.com)

# Start the backend server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

In a new terminal:

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# .env should have:
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## ✅ Verify Installation

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"JT CUTZ API is running"}
```

### 2. Check Gallery Endpoint
```bash
curl http://localhost:5000/api/gallery
# Should return array of 13 haircut styles
```

### 3. Open Frontend
- Open browser to `http://localhost:5173`
- You should see the JT CUTZ home page

---

## 🎯 Test the Features

### 1. **Home Page**
- View the gallery slider
- Try swiping on the gallery
- Click "Find Your Style" to test the quiz

### 2. **Create Account**
- Click "Get Started" or go to `/register`
- Register with test email
- For admin account, use the email set in `ADMIN_EMAIL` env var

### 3. **Take the Quiz**
- Click "Find Your Style"
- Answer 3 questions
- Get style recommendation
- "Book Now" button redirects to booking with pre-filled style

### 4. **Book an Appointment**
- Select a service
- Choose date and time
- Add optional notes
- Confirm booking
- Check email for confirmation

### 5. **Admin Dashboard**
- Log in with admin account
- Navigate to `/admin`
- View all appointments
- Filter by status
- Search by client name/email
- Cancel appointments

---

## 📧 Email Setup

### Gmail App Password

1. Go to [Google Account](https://myaccount.google.com)
2. Click **Security** (left sidebar)
3. **Turn on** 2-Step Verification (if not already)
4. Go back to **Security**
5. Look for **App passwords**
6. Select **Mail** and **Windows Computer**
7. Generate app password
8. Use this 16-character password in `.env` as `EMAIL_PASS`

### Test Email Sending

Book an appointment and check your email for confirmation.

---

## 🗄️ Database

### MongoDB Atlas Free Tier

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 free tier)
4. Create database user
5. Whitelist your IP
6. Get connection string
7. Add to `.env` as `MONGO_URI`

### Local MongoDB (Alternative)

```bash
# If you have MongoDB running locally
MONGO_URI=mongodb://localhost:27017/jtcutz
```

---

## 🔑 Default Admin Account

Create an account using the email in your `.env` `ADMIN_EMAIL` variable (default: `admin@jtcutz.com`).

This account will have admin privileges and access to:
- `/admin` — Admin dashboard
- View all appointments
- Cancel any appointment
- View appointment statistics

---

## 📱 Test Accounts

### Regular User
```
Email: user@example.com
Password: password123
```

### Admin
```
Email: admin@jtcutz.com  (or your ADMIN_EMAIL value)
Password: password123
```

---

## 🐛 Common Issues

### "ECONNREFUSED" Error
**Problem:** Backend can't connect to MongoDB
**Solution:** 
- Check `MONGO_URI` in `.env`
- Verify MongoDB Atlas IP whitelist includes your IP
- Verify credentials are correct

### "Network Error" When Booking
**Problem:** Frontend can't reach backend
**Solution:**
- Check `VITE_API_URL` in client `.env`
- Verify backend is running on port 5000
- Check CORS configuration in `server/index.js`

### Email Not Sending
**Problem:** Booking confirmation email fails
**Solution:**
- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Use Gmail app password (not your Gmail password)
- Check that 2FA is enabled on Gmail account

### Gallery Images Not Showing
**Problem:** Gallery slider shows but no images
**Solution:**
- Verify images exist in `client/public/images/gallery/`
- Check image file names match exactly (case-sensitive on Linux)
- Check browser console for 404 errors

---

## 📚 Project Structure

```
jtcutz/
├── client/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth context
│   │   ├── api/             # Axios instance
│   │   └── App.jsx          # Main app
│   ├── public/
│   │   └── images/gallery/  # 13 haircut images
│   └── package.json
│
├── server/
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── models/              # Database schemas
│   ├── middleware/          # Auth, validation
│   └── index.js             # Server entry
│
├── DEPLOYMENT.md            # Production setup guide
├── MILESTONE_5_SUMMARY.md   # What's new in M5
└── README.md                # Main project README
```

---

## 🚀 Next: Deploy to Production

When ready to deploy, follow the comprehensive guide in `DEPLOYMENT.md`:

1. Set up MongoDB Atlas
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Configure production environment variables
5. Run final tests

---

## 💡 Tips

- **Reset data:** Delete MongoDB database and recreate collection
- **Test email:** Book appointment with your email to verify email service
- **Admin features:** Log in with admin account to see admin dashboard
- **Responsive:** Test on mobile by opening DevTools and toggling device toolbar
- **Performance:** Use React DevTools to profile components

---

## 📞 Need Help?

### Common Resources
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)

### Check Logs
- **Backend:** Terminal where `npm run dev` is running
- **Frontend:** Browser DevTools Console (F12)
- **Database:** MongoDB Atlas logs dashboard

---

## ✨ Features Overview

### 👤 User Features
- ✅ Register and login
- ✅ Book appointments
- ✅ View appointment history
- ✅ Cancel appointments
- ✅ Receive email confirmations
- ✅ Get haircut recommendations

### 🎨 Extra Features
- ✅ Gallery slider (13 haircut styles)
- ✅ Style selector quiz
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

### 🛡️ Admin Features
- ✅ View all appointments
- ✅ Filter by status
- ✅ Search appointments
- ✅ Cancel any appointment
- ✅ View statistics
- ✅ Manage all bookings

---

**Happy coding! 🎉**
