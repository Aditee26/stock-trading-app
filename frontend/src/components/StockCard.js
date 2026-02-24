import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { buyStock, sellStock } from '../redux/slices/portfolioSlice';
import { toast } from 'react-toastify';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StockCard = ({ stock, userBalance }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [showTrade, setShowTrade] = useState(false);

  const handleBuy = async () => {
    if (quantity * stock.currentPrice > userBalance) {
      toast.error('Insufficient balance');
      return;
    }
    await dispatch(buyStock({ stockId: stock._id, quantity }));
    setShowTrade(false);
    setQuantity(1);
  };

  const handleSell = async () => {
    await dispatch(sellStock({ stockId: stock._id, quantity }));
    setShowTrade(false);
    setQuantity(1);
  };

  const priceChange = stock.dayChangePercent || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{stock.symbol}</h3>
          <p className="text-gray-600 text-sm">{stock.companyName}</p>
        </div>
        <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
          {stock.sector}
        </span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-2xl font-bold">
            ${stock.currentPrice?.toFixed(2)}
          </span>
          <div className={`flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-semibold">
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Volume</p>
          <p className="font-semibold">{(stock.volume / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {!showTrade ? (
        <button
          onClick={() => setShowTrade(true)}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Trade
        </button>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleBuy}
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Buy
            </button>
            <button
              onClick={handleSell}
              className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              Sell
            </button>
            <button
              onClick={() => setShowTrade(false)}
              className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-center text-gray-500">
            Total: ${(quantity * stock.currentPrice).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default StockCard;