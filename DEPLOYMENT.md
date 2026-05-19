# 🚀 Deployment Guide — JT CUTZ

This guide covers deployment to **Render** (backend) and **Vercel** (frontend) with **MongoDB Atlas** (database).

---

## 📋 Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Environment variables are configured
- [ ] Gallery images are in `client/public/images/gallery/`
- [ ] Email service is configured and tested
- [ ] Database is seeded (if needed)

---

## 🗄️ MongoDB Atlas Setup

### 1. Create a MongoDB Atlas Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for a free account
- Create a new project

### 2. Create a Cluster
- Click "Create a Cluster"
- Choose the **M0 (Free)** tier
- Select your preferred region (e.g., US East)
- Wait for the cluster to be provisioned

### 3. Create a Database User
- Go to **Security > Database Access**
- Click "Add New Database User"
- Set username (e.g., `jtcutz_user`)
- Set a strong password
- Click "Add User"

### 4. Whitelist Your IP
- Go to **Security > Network Access**
- Click "Add IP Address"
- Click "Allow access from anywhere" (for development)
  - **Note:** For production, add specific IPs only

### 5. Get Connection String
- Click "Connect"
- Choose "Connect your application"
- Copy the connection string
- Replace `<username>` and `<password>` with your database user credentials
- Replace `<dbname>` with your database name (e.g., `jtcutz`)

Example:
```
mongodb+srv://jtcutz_user:your_password@cluster0.xxxxx.mongodb.net/jtcutz?retryWrites=true&w=majority
```

---

## ⚙️ Backend Setup on Render

### 1. Push Backend to GitHub
```bash
cd server
git init
git add .
git commit -m "Initial backend commit"
git push origin main
```

### 2. Create a Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 3. Create a New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the `server` directory as the root directory
- Configure:
  - **Name:** `jtcutz-api`
  - **Environment:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `node index.js`
  - **Region:** Choose closest to your users

### 4. Add Environment Variables
Go to **Environment** and add:
```
MONGO_URI=mongodb+srv://jtcutz_user:password@cluster0.xxxxx.mongodb.net/jtcutz?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@jtcutz.com
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Copy your backend URL (e.g., `https://jtcutz-api.onrender.com`)

---

## 🎨 Frontend Setup on Vercel

### 1. Push Frontend to GitHub
```bash
cd client
git init
git add .
git commit -m "Initial frontend commit"
git push origin main
```

### 2. Create a Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 3. Import Project
- Click "New Project"
- Select your GitHub repository
- Select the `client` directory as the root
- Configure:
  - **Framework:** `Vite`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`

### 4. Add Environment Variables
In **Settings > Environment Variables**, add:
```
VITE_API_URL=https://jtcutz-api.onrender.com
```

Update `client/src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});
```

### 5. Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your app is now live! 🎉

---

## 📬 Email Configuration (Gmail)

### Enable Gmail App Password
1. Go to [Google Account](https://myaccount.google.com)
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Go to **App passwords**
5. Select **Mail** and **Windows Computer**
6. Generate password (16-character)
7. Use this password as `EMAIL_PASS` in your `.env`

---

## 🔒 Security Best Practices

- [ ] Never commit `.env` files
- [ ] Use strong, unique passwords for all services
- [ ] Enable 2FA on all accounts
- [ ] Whitelist only necessary IPs in MongoDB Atlas
- [ ] Regularly rotate API keys and secrets
- [ ] Monitor logs for suspicious activity
- [ ] Use HTTPS only
- [ ] Keep dependencies updated

---

## 📊 Monitoring & Maintenance

### Backend Logs
- Check Render dashboard for real-time logs
- Monitor error rates and response times

### Frontend Performance
- Use Vercel Analytics for performance insights
- Monitor Core Web Vitals

### Database
- Monitor MongoDB Atlas usage
- Set up alerts for high memory usage
- Regular backups are enabled by default

---

## 🆘 Troubleshooting

### Backend won't start
- Check `.env` variables in Render
- Verify MongoDB connection string
- Check for syntax errors: `node --check index.js`

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Clear cache and rebuild: `npm run build`

### Email not sending
- Check Gmail app password
- Verify email configuration in backend
- Check error logs for details

### CORS errors
- Verify `CLIENT_URL` in backend `.env`
- Add frontend URL to `cors` origin in `server/index.js`

---

## 📞 Support

For issues, check:
- MongoDB Atlas documentation: [docs.mongodb.com](https://docs.mongodb.com)
- Render documentation: [render.com/docs](https://render.com/docs)
- Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

**Happy Deploying! 🚀**
