import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import FraudshieldLogo from "./encrypted.png";

function Navbar() {
  const navigate = useNavigate();
  const { user, login, logout } = usePrivy();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      alert("Unable to login, try again later");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert("Unable to logout, try again later");
    }
  };
  
  return (
    <nav className="text-white py-4 px-4 shadow-md" style={{
      background: "linear-gradient(to right, #e53935, #e35d5b)",
    }}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={FraudshieldLogo} alt="Health Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-semibold">FraudShield</h1>
        </div>
        
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✖' : '☰'}
        </button>

        <div className="hidden lg:flex space-x-4">
          {user ? (
            <>
              <button
                className="text-black bg-white font-bold px-3 py-2 rounded-md transition"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white"
                onClick={() => navigate("/fraud-detection")}
              >
                Fraud Detection
              </button>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white"
                onClick={() => navigate("/fraud-reporting")}
              >
                Fraud Reporting
              </button>
            </>
          ) : (
            <>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white"
                onClick={handleLogin}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden flex flex-col space-y-2 mt-4 items-center">
          {user ? (
            <>
              <button
                className="text-black bg-white font-bold px-3 py-2 rounded-md transition"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white w-full"
                onClick={() => navigate("/fraud-detection")}
              >
                Fraud Detection
              </button>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white w-full"
                onClick={() => navigate("/fraud-reporting")}
              >
                Fraud Reporting
              </button>
            </>
          ) : (
            <>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white w-full"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="font-bold px-3 py-2 rounded-md transition bg-black text-white w-full"
                onClick={handleLogin}
              >
                Signup
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
export default Navbar;
