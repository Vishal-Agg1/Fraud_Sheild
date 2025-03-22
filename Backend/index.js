const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes/Router');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://fraud-sheild.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  
  try {
    await connectDB();
    isConnected = true;
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed:", error);
    throw error;
  }
};

// Routes
app.get('/', async (req, res) => {
  await connectToDatabase();
  res.send('Fraud Detection API is running...');
});

// Test route for debugging
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// API Routes - ensure database connection first
app.use('/api', async (req, res, next) => {
  await connectToDatabase();
  next();
}, routes);

// For Vercel deployment
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;
