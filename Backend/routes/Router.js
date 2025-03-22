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
router.get('/fraud-trends', async (req, res) => {
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
    
    res.json(trends);
  } catch (error) {
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
            return {
                transaction_id: transaction.id,
                ...await fraudDetectionService.detectFraud(transaction)
            };
        }));

        res.json({ results });
    } catch (error) {
        console.error("Error processing batch fraud detection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

