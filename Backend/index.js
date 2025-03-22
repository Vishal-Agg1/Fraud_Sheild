const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes/Router');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure database connection is established before handling requests
(async () => {
  try {
    await connectDB();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
})();

// Routes
app.get('/', (req, res) => {
  res.send('Fraud Detection API is running...');
});

// API Routes
app.use('/api', routes);

// Export the app for Vercel
module.exports = app;
