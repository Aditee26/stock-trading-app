const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/auth');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id })
      .populate('holdings.stock');

    if (!portfolio) {
      portfolio = await Portfolio.create({
        user: req.user.id,
        holdings: [],
        totalValue: 100000,
        totalProfitLoss: 0,
        dayProfitLoss: 0
      });
    }

    // Calculate current values
    let totalValue = 0;
    let totalProfitLoss = 0;
    let dayProfitLoss = 0;

    for (const holding of portfolio.holdings) {
      const currentPrice = holding.stock.currentPrice;
      const currentValue = currentPrice * holding.quantity;
      const profitLoss = currentValue - holding.totalInvestment;
      const dayChange = holding.stock.dayChange * holding.quantity;

      totalValue += currentValue;
      totalProfitLoss += profitLoss;
      dayProfitLoss += dayChange;
    }

    portfolio.totalValue = totalValue + req.user.virtualBalance;
    portfolio.totalProfitLoss = totalProfitLoss;
    portfolio.dayProfitLoss = dayProfitLoss;

    await portfolio.save();

    res.json({
      success: true,
      data: {
        portfolio,
        cashBalance: req.user.virtualBalance,
        totalValue: portfolio.totalValue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add to watchlist
// @route   POST /api/portfolio/watchlist/:stockId
// @access  Private
router.post('/watchlist/:stockId', protect, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.stockId);
    if (!stock) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stock not found' 
      });
    }

    let watchlist = await Watchlist.findOne({ user: req.user.id });
    
    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: req.user.id,
        stocks: [stock._id]
      });
    } else {
      if (!watchlist.stocks.includes(stock._id)) {
        watchlist.stocks.push(stock._id);
        await watchlist.save();
      }
    }

    res.json({
      success: true,
      data: watchlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;