import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Temporary placeholder components until we create the full ones
const Login = () => <div className="p-8 text-center">Login Page (Coming Soon)</div>;
const Register = () => <div className="p-8 text-center">Register Page (Coming Soon)</div>;
const Dashboard = () => <div className="p-8 text-center">Dashboard (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-600 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="text-xl font-bold">SB Stocks</div>
              <div className="space-x-4">
                <button className="bg-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-800">
                  Login
                </button>
                <button className="bg-indigo-500 px-4 py-2 rounded-md hover:bg-indigo-600">
                  Register
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
        
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;