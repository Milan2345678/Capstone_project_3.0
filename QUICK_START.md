# 🚀 QUICK START GUIDE

## Prerequisites

- ✅ Node.js installed (https://nodejs.org/)
- ✅ MongoDB running locally OR MongoDB Atlas account

---

## Step 1: Check System Health

```bash
cd capstone_3.0
npm diagnose
```

This will verify MongoDB, environment, and file structure.

---

## Step 2: Populate Database (One-time setup)

```bash
npm run seed
```

Expected output:

```
Connected to MongoDB
✓ Seeded 73 colleges successfully!
```

---

## Step 3: Start Backend

**Terminal 1:**

```bash
cd capstone_3.0
npm run dev
```

Expected output:

```
✓ MongoDB Connected Successfully
✓ Found 73 colleges in database
✓ Server running on http://localhost:5000
```

---

## Step 4: Start Frontend

**Terminal 2:**

```bash
cd capstone_3.0/client
npm start
```

Expected output:

```
✓ Compiled successfully!
Ready on http://localhost:3000
```

---

## ✅ Success!

Open browser: **http://localhost:3000**

You should see:

- College Advisor navbar
- Home page with features
- Recommendations page with form

---

## ❌ Issues?

### "Failed to get recommendations"

```bash
# Verify backend is responding
curl http://localhost:5000/api/health

# If not, check MongoDB is running
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Reseed database
npm run seed
```

### "Cannot find module"

```bash
npm install
cd client
npm install
```

### "Port already in use"

```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# Then: taskkill /PID <PID> /F

# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Then: taskkill /PID <PID> /F
```

---

## 📊 Test the API

```bash
# Get all colleges
curl http://localhost:5000/api/colleges

# Get recommendations
curl -X POST http://localhost:5000/api/colleges/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "rank": 5000,
    "category": "general"
  }'

# Health check
curl http://localhost:5000/api/health
```

---

## 🎯 Features Available

✅ **Smart Recommendations** - Enter rank, category, state, budget
✅ **Preference Slider** - Adjust college vs course priority
✅ **Detailed Results** - View NIRF ranking, fees, placement data
✅ **AI Explanations** - Get insights (if OpenAI key configured)
✅ **Professional UI** - Clean, minimal, responsive design

---

## 🔐 Optional: Enable AI Features

1. Get OpenAI API key: https://platform.openai.com/api-keys
2. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart backend server

---

**That's it!** 🎓 Your college recommendation system is ready!

For detailed setup guide, see: `SETUP.md`
