const express = require('express');
const router = express.Router();
const {
  buyStock,
  sellStock,
  getUserTransactions
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.post('/buy', buyStock);
router.post('/sell', sellStock);
router.get('/', getUserTransactions);

module.exports = router;