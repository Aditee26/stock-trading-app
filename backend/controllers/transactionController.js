const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const User = require('../models/User');

// @desc    Buy stock
// @route   POST /api/transactions/buy
// @access  Private
const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.user.id;

    // Get stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stock not found' 
      });
    }

    const totalCost = stock.currentPrice * quantity;

    // Check user balance
    const user = await User.findById(userId);
    if (user.virtualBalance < totalCost) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    // Update user balance
    user.virtualBalance -= totalCost;
    await user.save();

    // Get or create portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      portfolio = await Portfolio.create({
        user: userId,
        holdings: [],
        totalValue: 0,
        totalProfitLoss: 0,
        dayProfitLoss: 0
      });
    }

    // Update portfolio holdings
    const holdingIndex = portfolio.holdings.findIndex(
      h => h.stock.toString() === stockId
    );

    if (holdingIndex > -1) {
      // Update existing holding
      const holding = portfolio.holdings[holdingIndex];
      const newQuantity = holding.quantity + quantity;
      const newTotalInvestment = holding.totalInvestment + totalCost;
      
      portfolio.holdings[holdingIndex] = {
        ...holding,
        quantity: newQuantity,
        averageBuyPrice: newTotalInvestment / newQuantity,
        totalInvestment: newTotalInvestment
      };
    } else {
      // Add new holding
      portfolio.holdings.push({
        stock: stockId,
        quantity,
        averageBuyPrice: stock.currentPrice,
        totalInvestment: totalCost
      });
    }

    // Update portfolio total value
    portfolio.totalValue += totalCost;
    await portfolio.save();

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      stock: stockId,
      type: 'BUY',
      quantity,
      price: stock.currentPrice,
      totalAmount: totalCost
    });

    res.status(201).json({
      success: true,
      data: {
        transaction,
        balance: user.virtualBalance,
        portfolio
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sell stock
// @route   POST /api/transactions/sell
// @access  Private
const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.user.id;

    // Get stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stock not found' 
      });
    }

    // Get portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(404).json({ 
        success: false, 
        message: 'Portfolio not found' 
      });
    }

    // Check if user owns enough shares
    const holding = portfolio.holdings.find(
      h => h.stock.toString() === stockId
    );

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient shares' 
      });
    }

    const totalAmount = stock.currentPrice * quantity;

    // Update portfolio
    holding.quantity -= quantity;
    holding.totalInvestment = (holding.averageBuyPrice * holding.quantity);

    if (holding.quantity === 0) {
      // Remove holding if quantity becomes 0
      portfolio.holdings = portfolio.holdings.filter(
        h => h.stock.toString() !== stockId
      );
    }

    portfolio.totalValue -= totalAmount;
    await portfolio.save();

    // Update user balance
    const user = await User.findById(userId);
    user.virtualBalance += totalAmount;
    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      stock: stockId,
      type: 'SELL',
      quantity,
      price: stock.currentPrice,
      totalAmount
    });

    res.json({
      success: true,
      data: {
        transaction,
        balance: user.virtualBalance,
        portfolio
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('stock', 'symbol companyName')
      .sort('-timestamp');

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  buyStock,
  sellStock,
  getUserTransactions
};