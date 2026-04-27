# College Recommendation System - Setup Guide

## 🚀 Quick Start

### Step 1: Install Dependencies

**Backend:**

```bash
cd capstone_3.0
npm install
```

**Frontend:**

```bash
cd client
npm install
```

---

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB

1. **Install MongoDB Community Edition:**
   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   - macOS: `brew tap mongodb/brew && brew install mongodb-community`
   - Linux: Follow official docs

2. **Start MongoDB:**

   ```bash
   # Windows (run in PowerShell as Admin)
   mongod

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

3. **.env already configured for local MongoDB:**
   ```
   MONGO_URI=mongodb://localhost:27017/college_recommendation
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/college_recommendation
   ```

---

### Step 3: Populate Database

After MongoDB is running:

```bash
cd capstone_3.0
npm run seed
```

Expected output:

```
✓ Connected to MongoDB
✓ Cleared existing colleges
✓ Seeded 73 colleges successfully!
```

---

### Step 4: Configure OpenAI (Optional for AI Features)

To use AI explanations and chat features:

1. Get API key from https://platform.openai.com/api-keys
2. Update `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

---

### Step 5: Start the Application

**Terminal 1 - Backend:**

```bash
cd capstone_3.0
npm run dev
```

Expected output:

```
✓ MongoDB Connected Successfully
✓ Found 73 colleges in database
✓ Server running on http://localhost:5000
✓ API health check: http://localhost:5000/api/health
```

**Terminal 2 - Frontend:**

```bash
cd capstone_3.0/client
npm start
```

Expected output:

```
✓ Compiled successfully!
✓ Ready on http://localhost:3000
```

---

## 🔍 Troubleshooting

### Error: "Failed to get recommendations"

**Solution:**

```bash
# Verify MongoDB is running
curl http://localhost:5000/api/health

# If MongoDB isn't connected, start it:
# Windows: mongod
# macOS: brew services start mongodb-community

# Reseed database
cd capstone_3.0
npm run seed
```

### Error: "MONGO_URI not defined"

**Solution:**

- Ensure `.env` file exists in `capstone_3.0/` root directory
- Restart backend server after creating/modifying `.env`

### Error: "Module not found"

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### AI Features Not Working

**Solution:**

1. Ensure `OPENAI_API_KEY` is set in `.env`
2. Verify key is valid at https://platform.openai.com/account/api-keys
3. Check you have API credits
4. Restart backend server

---

## 📊 API Endpoints

| Method | Endpoint                   | Purpose             |
| ------ | -------------------------- | ------------------- |
| GET    | `/api/colleges`            | Fetch all colleges  |
| POST   | `/api/colleges/recommend`  | Get recommendations |
| POST   | `/api/colleges/ai/explain` | Get AI explanation  |
| POST   | `/api/colleges/chat`       | Chat with AI        |
| GET    | `/api/health`              | Check server status |

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get all colleges
curl http://localhost:5000/api/colleges

# Get recommendations
curl -X POST http://localhost:5000/api/colleges/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "rank": 5000,
    "category": "general",
    "state": "Delhi",
    "budget": 1500000,
    "preferredBranches": ["Computer Science and Engineering"],
    "preferenceWeight": 50
  }'
```

---

## 📁 Project Structure

```
capstone_3.0/
├── server.js                 # Backend entry point
├── .env                      # Environment variables
├── package.json              # Backend dependencies
│
├── controllers/
│   └── collegeController.js   # Business logic
├── models/
│   ├── college.js            # College schema
│   └── User.js               # User schema
├── routes/
│   └── collegeRoutes.js       # API routes
├── data/
│   └── colleges.json         # 73 colleges data
├── scripts/
│   └── seed.js               # Database seeding
│
└── client/                    # React frontend
    ├── public/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Recommendations.js
    │   │   ├── Chat.js
    │   │   └── Profile.js
    │   ├── components/
    │   │   └── Navbar.js
    │   └── styles/
    └── package.json
```

---

## 🎯 Features

✅ 73 colleges database (IITs, NITs, IIITs, Private, Government)
✅ Smart recommendation algorithm (Safe/Target/Dream categorization)
✅ Preference slider (College vs Course priority)
✅ AI-powered explanations (requires OpenAI API key)
✅ AI chatbot for college counseling
✅ Professional responsive UI
✅ Real-time college matching
✅ Placement data integration

---

## 🔐 Security Features

- Helmet.js for security headers
- CORS enabled
- Rate limiting (1000 requests/15 min in dev)
- MongoDB connection validation
- Error handling with detailed logging

---

## 📞 Support

If you encounter issues:

1. **Check logs** in both terminals
2. **Verify MongoDB** is running: `mongod --version`
3. **Test API**: `curl http://localhost:5000/api/health`
4. **Check ports**:
   - Backend: `netstat -ano | findstr :5000` (Windows)
   - Frontend: `netstat -ano | findstr :3000` (Windows)
5. **Clear cache**: Delete `node_modules` and reinstall

---

## 📌 Important Notes

- Always start **MongoDB first**, then **backend**, then **frontend**
- Run `npm run seed` whenever you reset the database
- Keep `.env` file secure (never commit to git)
- Backend must be running on port 5000 for frontend to work
- Frontend proxy is configured in `client/package.json`

---

Happy coding! 🎓
