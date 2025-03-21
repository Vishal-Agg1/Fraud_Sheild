import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePrivy } from "@privy-io/react-auth";


export default function Footer() {

  const { login } = usePrivy();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      alert("Unable to login, try again later");
    }
  };
  // Check if current path is one where we should hide the Get Started button
  const hideGetStarted = ['/dashboard'].includes(location.pathname);
  return (
    <footer className="bg-black text-white py-10 h-[400px]">
      <div className="container mx-auto text-center px-5 mt-10">
        {/* Logo and Title */}
        <div className="flex justify-center items-center mb-5">
          <h1
            className="text-4xl font-bold"
            style={{
              background: "linear-gradient(to right, #e53935, #e35d5b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            FraudShield
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-lg text-gray-300 mb-5">
        Protecting users from online scams
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mb-10">
          {!hideGetStarted && (
            <button
              onClick={handleLogin}
              className="px-6 py-2 text-white font-medium rounded-lg"
              style={{
                background: `linear-gradient(to right, #e53935, #e35d5b)`,
              }}
            >
              Get Started
            </button>
          )}
          
        </div>

        {/* Footer Links */}
        <div className="text-sm text-gray-400">
          <p>
          Copyright &copy; 2025 FraudShield. All Rights Reserved.
          </p>
          <p>
            Created and Designed by <span className="text-white font-semibold">Idea Factory</span>
          </p>
        </div>
      </div>
    </footer>
  );
}