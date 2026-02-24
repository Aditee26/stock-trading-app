const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStockBySymbol,
  updateStockPrice,
  fetchStockData
} = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getStocks)
  .post(protect, authorize('admin'), fetchStockData);

router.get('/:symbol', getStockBySymbol);
router.put('/:id', protect, authorize('admin'), updateStockPrice);

module.exports = router;