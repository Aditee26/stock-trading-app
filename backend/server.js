const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected...');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('subscribe', (stockSymbols) => {
    stockSymbols.forEach(symbol => {
      socket.join(`stock-${symbol}`);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Broadcast stock updates every 5 seconds (for demo)
setInterval(async () => {
  try {
    const stocks = await Stock.find();
    stocks.forEach(stock => {
      // Simulate price change
      const change = (Math.random() - 0.5) * 2;
      const newPrice = stock.currentPrice * (1 + change / 100);
      
      io.to(`stock-${stock.symbol}`).emit('priceUpdate', {
        symbol: stock.symbol,
        price: newPrice,
        change: change,
        timestamp: new Date()
      });
    });
  } catch (error) {
    console.error('Error broadcasting updates:', error);
  }
}, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});