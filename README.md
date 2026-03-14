# 📈 Stock Trading App - MERN Stack

A full-stack stock trading simulation platform that allows users to practice buying and selling stocks with virtual funds. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it features real-time market data, secure authentication, and comprehensive portfolio management.

## 🚀 Live Application

**Live**: [https://stock-trading-smartbridge.netlify.app](https://stock-trading-smartbridge.netlify.app)

## ✨ Features

### 👤 User Features
- **User Authentication** - Secure JWT-based registration and login
- **Virtual Trading** - Start with $100,000 virtual money to practice trading
- **Real-time Stock Data** - Live price updates via WebSocket connections
- **Stock Market Browser** - Search, filter, and browse US stocks
- **Advanced Order Types** - Market, Limit, Stop, and Stop-Limit orders
- **Portfolio Management** - Track holdings, profits/losses, and performance
- **Watchlist** - Save favorite stocks with price alerts
- **Transaction History** - Complete trade history with filtering
- **Interactive Charts** - Visualize stock performance with multiple timeframes
- **Technical Indicators** - RSI, MACD, Moving Averages, and more

### 👑 Admin Features
- **User Management** - View, edit, and manage user accounts
- **Stock Management** - Add, update, and remove stocks
- **System Monitoring** - Track platform usage and performance
- **Transaction Oversight** - Monitor all trading activity

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **Chart.js / Recharts** - Data visualization
- **Socket.io-client** - Real-time updates
- **Axios** - API requests
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.io** - Real-time WebSocket connections
- **bcryptjs** - Password encryption
- **Express Validator** - Input validation

### DevOps
- **GitHub** - Version control
- **Render** - Backend hosting
- **Netlify** - Frontend hosting
- **MongoDB Atlas** - Cloud database

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**

## 🔧 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Aditee26/stock-trading-app.git
cd stock-trading-app
2. Backend Setup
bash
cd backend
npm install
Create a .env file in the backend folder:

env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stock_trading
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
Start the backend server:

bash
npm run dev
3. Frontend Setup
bash
cd frontend
npm install
Create a .env file in the frontend folder:

env
REACT_APP_API_URL=http://localhost:5000/api
Start the frontend development server:

bash
npm start
4. Access Locally
Frontend: http://localhost:3000

Backend API: http://localhost:5000

Health Check: http://localhost:5000/health

📁 Project Structure
text
stock-trading-app/
├── backend/                    # Backend Node.js/Express application
│   ├── controllers/            # Business logic
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── socket/                 # WebSocket handlers
│   └── server.js               # Main server file
│
└── frontend/                   # Frontend React application
    ├── public/                 # Static files
    └── src/
        ├── components/         # Reusable components
        ├── pages/              # Page components
        ├── redux/              # State management
        ├── services/           # API services
        ├── App.js              # Main App component
        └── index.js            # Entry point
🎯 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user
POST	/api/auth/logout	Logout user
Stocks
Method	Endpoint	Description
GET	/api/stocks	Get all stocks
GET	/api/stocks/:symbol	Get single stock
GET	/api/stocks/search/:query	Search stocks
GET	/api/stocks/movers/:type	Get market movers
Trading
Method	Endpoint	Description
POST	/api/transactions/buy	Buy stock
POST	/api/transactions/sell	Sell stock
GET	/api/transactions	Get user transactions
Portfolio
Method	Endpoint	Description
GET	/api/portfolio	Get user portfolio
POST	/api/portfolio/watchlist/:stockId	Add to watchlist
DELETE	/api/portfolio/watchlist/:stockId	Remove from watchlist
🧪 Testing
bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Team
Aditee Singh - Full Stack Developer - GitHub

📧 Contact
Aditee Singh - aditeesingh2006@gmail.com

Project Link: https://github.com/Aditee26/stock-trading-app

⭐ If you found this project helpful, please give it a star on GitHub!
text
