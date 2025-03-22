const express = require('express');
const router = express.Router();
const { detectFraud, getFraudStats } = require('../controllers/Fraud');
const { getAllTransactions, getTransactionById} = require('../controllers/getransac');
const { reportFraud } = require('../controllers/fraudreport');
const Transaction = require('../models/Transaction');

// Transaction routes
router.get('/transactions', getAllTransactions);
router.get('/transactions/:id', getTransactionById);

// Fraud detection routes
router.post('/detect', detectFraud);
router.get('/stats', getFraudStats);
router.post('/report', reportFraud);

// Fraud trend analytics
router.get('/fraud-trends', async (req, res) => {
  console.log("Received request for fraud-trends");
  try {
    const trends = await Transaction.aggregate([
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$transaction_date" } 
          },
          count: { $sum: 1 },
          fraudCount: { 
            $sum: { $cond: [{ $eq: ["$is_fraud_predicted", true] }, 1, 0] } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    console.log("Fraud trends results:", trends);
    res.json(trends);
  } catch (error) {
    console.error("Error fetching fraud trends:", error);
    res.status(500).json({ error: error.message });
  }
});

// Batch fraud detection
router.post('/batch-fraud-detection', async (req, res) => {
    try {
        const transactions = req.body.transactions; // Expecting an array of transactions

        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({ error: "Invalid input, expected an array of transactions." });
        }

        // Process transactions in parallel
        const results = await Promise.all(transactions.map(async (transaction) => {
            try {
                // Simplified implementation for now
                return {
                    transaction_id: transaction.id,
                    is_fraud: Math.random() > 0.8, // Random fraud determination for testing
                    fraud_score: Math.random(),
                    reason: "Batch processing test"
                };
            } catch (err) {
                console.error(`Error processing transaction ${transaction.id}:`, err);
                return {
                    transaction_id: transaction.id,
                    error: "Failed to process"
                };
            }
        }));

        res.json({ results });
    } catch (error) {
        console.error("Error processing batch fraud detection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

