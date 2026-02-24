const Stock = require('../models/Stock');
const axios = require('axios');

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Public
const getStocks = async (req, res) => {
  try {
    const { search, sector, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    if (sector) {
      query.sector = sector;
    }

    const stocks = await Stock.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ symbol: 1 });

    const total = await Stock.countDocuments(query);

    res.json({
      success: true,
      data: stocks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single stock
// @route   GET /api/stocks/:symbol
// @access  Public
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ 
      symbol: req.params.symbol.toUpperCase() 
    });

    if (!stock) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stock not found' 
      });
    }

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update stock price (for admin)
// @route   PUT /api/stocks/:id
// @access  Private/Admin
const updateStockPrice = async (req, res) => {
  try {
    const { price } = req.body;
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stock not found' 
      });
    }

    stock.previousClose = stock.currentPrice;
    stock.currentPrice = price;
    stock.dayChange = price - stock.previousClose;
    stock.dayChangePercent = ((price - stock.previousClose) / stock.previousClose) * 100;
    stock.lastUpdated = Date.now();

    await stock.save();

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch real-time stock data from API
// @route   POST /api/stocks/fetch
// @access  Private/Admin
const fetchStockData = async (req, res) => {
  try {
    const { symbols } = req.body;
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    for (const symbol of symbols) {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
        );

        const data = response.data['Global Quote'];
        
        if (data && Object.keys(data).length > 0) {
          await Stock.findOneAndUpdate(
            { symbol },
            {
              currentPrice: parseFloat(data['05. price']),
              dayChange: parseFloat(data['09. change']),
              dayChangePercent: parseFloat(data['10. change percent'].replace('%', '')),
              volume: parseInt(data['06. volume']),
              lastUpdated: Date.now()
            }
          );
        }
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
      }
    }

    res.json({
      success: true,
      message: 'Stock data updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStocks,
  getStockBySymbol,
  updateStockPrice,
  fetchStockData
};