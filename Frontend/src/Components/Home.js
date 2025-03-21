import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";

const FeatureCard = ({ image, title, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="w-full md:w-40 px-4 md:px-0">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="relative h-44 bg-black flex items-center justify-center overflow-hidden rounded-2xl"
      >
        <img
          src={image}
          alt={`${title} Logo`}
          className="absolute z-10 w-20 h-12 object-contain mb-9"
        />
        <h2 className="z-10 text-white text-xl md:text-[23px] mt-24">{title}</h2>
        <div className="absolute w-24 h-[130%] bg-gradient-to-b from-red-400 to-red-600 animate-rotate"></div>
        <div className="absolute inset-1 bg-black rounded-xl"></div>
      </motion.div>
    </div>
  );
};

const Step = ({ number, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="text-center w-full md:w-1/3 px-4 mb-8 md:mb-0"
    >
      <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
        <span className="text-2xl font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </motion.div>
  );
};

export default function Home() {
  const { login } = usePrivy();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      alert("Login error");
    }
  };

  return (
    <div className="overflow-x-hidden">
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="min-h-[46vh] flex items-center justify-center bg-black text-white px-4"
      >
        <div className="text-center p-4 md:p-8 rounded-xl max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-white mb-4">
            Welcome to FraudShield
          </h1>
          <p className="text-base md:text-lg mb-8">
            Detect. Prevent. Secure. – Your Shield Against Online Fraud
          </p>
          <button
            onClick={handleLogin}
            className="px-6 py-3 text-base md:text-lg text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg 
                     hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </motion.div>

      <div className="bg-black py-16 md:py-24 text-white px-4 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">How it Works</h2>
          <p className="text-base md:text-lg text-center max-w-2xl mx-auto mb-12">
            FraudShield employs AI-driven algorithms to analyze transaction patterns, detect anomalies, and prevent fraudulent activities in real time.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
            <Step number="1" title="Register" description="Sign up and connect your payment accounts." index={0} />
            <Step number="2" title="Monitor Transactions" description="FraudShield analyzes every transaction for suspicious activities." index={1} />
            <Step number="3" title="Stay Secure" description="Receive real-time alerts and safeguard your finances." index={2} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white py-16 px-4"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Aim</h2>
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto lg:h-52 lg:mt-20">
          At FraudShield, we are committed to making online transactions safer and fraud-free. With the rise of digital payments, the risk of fraud has significantly increased, making it crucial to have an intelligent and reliable fraud detection system.

Our platform uses AI-powered algorithms and real-time analysis to detect suspicious transactions, prevent financial fraud, and secure your online activities. We empower businesses and individuals with cutting-edge fraud prevention tools, ensuring a seamless and secure payment experience.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-black py-16 text-white px-4 mb-20"
      >
        <div className="container mx-auto lg:h-80 lg:mt-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Us</h2>
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto">
            FraudShield is a cutting-edge fraud detection platform designed to protect individuals and businesses from online scams and fraudulent transactions. Using AI-powered analytics, we provide real-time insights and proactive security measures to ensure safe digital transactions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}