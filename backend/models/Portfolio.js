const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  holdings: [{
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    averageBuyPrice: {
      type: Number,
      required: true
    },
    totalInvestment: {
      type: Number,
      required: true
    }
  }],
  totalValue: {
    type: Number,
    default: 0
  },
  totalProfitLoss: {
    type: Number,
    default: 0
  },
  dayProfitLoss: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);