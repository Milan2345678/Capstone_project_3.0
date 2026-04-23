# AI-Based College and Course Recommendation System

A production-level MERN stack application that helps JEE aspirants make informed college choices during counseling using AI-powered recommendations.

## 🎯 Features

- **Smart Recommendations**: Get personalized college suggestions based on JEE rank, category, and preferences
- **AI-Powered Explanations**: Understand why colleges are recommended with detailed AI analysis
- **Intelligent Categorization**: Colleges categorized as Safe, Target, or Dream based on admission chances
- **Interactive Chat**: Ask questions to an AI counselor about counseling strategies and college choices
- **Comprehensive Database**: Information about NITs, IIITs, and other top engineering colleges
- **User Profiles**: Save preferences and search history

## 🏗️ Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **OpenAI API** for AI explanations and chat
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** and **express-rate-limit** for security

### Frontend

- **React.js** with Material-UI
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd capstone_3.0
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `.env` file and update the values:

   ```env
   MONGO_URI=mongodb://localhost:27017/college_recommendation
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Seed the database**

   ```bash
   npm run seed
   ```

6. **Start the application**

   ```bash
   # Start backend (from root directory)
   npm run dev

   # Start frontend (from client directory)
   cd client
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 API Endpoints

### Colleges

- `GET /api/colleges` - Get all colleges
- `POST /api/colleges/recommend` - Get recommendations
- `POST /api/colleges/ai/explain` - Get AI explanation for recommendation
- `POST /api/colleges/chat` - Chat with AI assistant

### Users

- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

## 🗄️ Database Schema

### College Collection

```javascript
{
  name: String,
  state: String,
  type: String, // NIT, IIIT, etc.
  nirfRanking: Number,
  fees: Number,
  placement: {
    averagePackage: Number,
    highestPackage: Number
  },
  branches: [{
    name: String,
    cutoff: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number
    },
    seats: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number
    }
  }]
}
```

### User Collection

```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  rank: Number,
  category: String,
  state: String,
  budget: Number,
  preferredBranches: [String],
  searchHistory: [{
    rank: Number,
    category: String,
    results: [Object],
    searchedAt: Date
  }]
}
```

## 🤖 Recommendation Logic

1. **Input Processing**: Rank, category, state preference, budget, branch preferences
2. **Filtering**: Filter colleges by state and branch preferences
3. **Categorization**:
   - **Safe**: rank < cutoff × 0.8 (high chance)
   - **Target**: rank within ±20% of cutoff (moderate chance)
   - **Dream**: rank > cutoff (ambitious choice)
4. **Sorting**: By category priority (Safe > Target > Dream), then NIRF ranking
5. **AI Enhancement**: Generate explanations for recommendations

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet for security headers
- Input validation with express-validator
- CORS configuration

## 🚀 Deployment

### Backend Deployment

```bash
npm run build
npm start
```

### Frontend Deployment

```bash
cd client
npm run build
# Serve the build folder with any static server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For questions or support, please contact the development team.

---

**Made with ❤️ for JEE aspirants**
