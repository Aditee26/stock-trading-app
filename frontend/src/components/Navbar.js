import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { 
  HomeIcon, 
  ChartBarIcon, 
  WalletIcon, 
  ArrowPathIcon,
  StarIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Stock Market', path: '/stocks', icon: ChartBarIcon },
    { name: 'Portfolio', path: '/portfolio', icon: WalletIcon },
    { name: 'Transactions', path: '/transactions', icon: ArrowPathIcon },
    { name: 'Watchlist', path: '/watchlist', icon: StarIcon },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: UserGroupIcon }] : [])
  ];

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              SB Stocks
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-indigo-200">Welcome, </span>
                <span className="font-semibold">{user.name}</span>
              </div>
              <div className="bg-indigo-700 px-3 py-1 rounded-full text-sm">
                ${user.virtualBalance?.toLocaleString()}
              </div>
              <button
                onClick={handleLogout}
                className="bg-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;