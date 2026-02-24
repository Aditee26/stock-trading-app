import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getPortfolio } from '../redux/slices/portfolioSlice';
import { getStocks } from '../redux/slices/stockSlice';
import StockCard from '../components/StockCard';
import { 
  CurrencyDollarIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  ChartPieIcon 
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { portfolio, isLoading: portfolioLoading } = useSelector(state => state.portfolio);
  const { stocks, isLoading: stocksLoading } = useSelector(state => state.stocks);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    dispatch(getPortfolio());
    dispatch(getStocks({ limit: 6 }));
  }, [dispatch]);

  useEffect(() => {
    if (portfolio?.holdings) {
      const labels = portfolio.holdings.map(h => h.stock.symbol);
      const data = portfolio.holdings.map(h => h.stock.currentPrice * h.quantity);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Portfolio Value',
            data,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2
          }
        ]
      });
    }
  }, [portfolio]);

  const stats = [
    {
      name: 'Total Value',
      value: `$${portfolio?.totalValue?.toLocaleString() || '0'}`,
      icon: CurrencyDollarIcon,
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      name: 'Today\'s P/L',
      value: `$${portfolio?.dayProfitLoss?.toFixed(2) || '0'}`,
      icon: portfolio?.dayProfitLoss >= 0 ? TrendingUpIcon : TrendingDownIcon,
      change: `${portfolio?.dayProfitLoss >= 0 ? '+' : ''}${((portfolio?.dayProfitLoss / portfolio?.totalValue) * 100)?.toFixed(2) || '0'}%`,
      changeType: portfolio?.dayProfitLoss >= 0 ? 'increase' : 'decrease'
    },
    {
      name: 'Total P/L',
      value: `$${portfolio?.totalProfitLoss?.toFixed(2) || '0'}`,
      icon: portfolio?.totalProfitLoss >= 0 ? TrendingUpIcon : TrendingDownIcon,
      change: `${((portfolio?.totalProfitLoss / (portfolio?.totalValue - portfolio?.totalProfitLoss)) * 100)?.toFixed(2) || '0'}%`,
      changeType: portfolio?.totalProfitLoss >= 0 ? 'increase' : 'decrease'
    },
    {
      name: 'Cash Balance',
      value: `$${user?.virtualBalance?.toLocaleString() || '0'}`,
      icon: ChartPieIcon,
      change: 'Available',
      changeType: 'neutral'
    }
  ];

  if (portfolioLoading || stocksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.changeType === 'increase' ? 'bg-green-100' :
                stat.changeType === 'decrease' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.changeType === 'increase' ? 'text-green-600' :
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                }`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' :
                stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Distribution</h2>
          <div className="h-64">
            <Line 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Popular Stocks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Popular Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks?.map(stock => (
            <StockCard key={stock._id} stock={stock} userBalance={user?.virtualBalance} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;