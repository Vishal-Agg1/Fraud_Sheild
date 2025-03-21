const mongoose = require("mongoose");

const Transaction = require("../models/Transaction"); 
const {PythonShell} = require("python-shell");


const detectFraud = async (req, res) => {
    const { transaction_amount, transaction_channel, time } = req.body;
    const transactionc = { 'w': 1, 'mobile': 2, 'W': 3, 'M': 4, '#': 5, 'npm': 6, '1': 7, 'WEB': 8, '5666': 9 };
    let inputData = JSON.stringify({ 
        transaction_amount, 
        transaction_channel: transactionc[transaction_channel] || 0,
        time: new Date(time).getTime() // Converts to milliseconds since epoch
    });

    
    const transactioncReverse = Object.fromEntries(Object.entries(transactionc).map(([k, v]) => [v, k])); // Reverse mapping

    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './',
        args: [inputData]
    };

    PythonShell.run('predict.py', options)
        .then(messages => {
            console.log("Python Output:", messages);
            try {
                let prediction = JSON.parse(messages[0]); // Parse JSON from Python
                const channelString = transactioncReverse[transaction_channel] || "Unknown"; // Decode transaction_channel
                
                const transaction = new Transaction({
                    transaction_id: req.body.transaction_id,
                    transaction_date: time,
                    transaction_amount: transaction_amount,
                    transaction_channel: channelString||"web", // ✅ Store original string instead of number
                    transaction_payment_mode: req.body.transaction_payment_mode || "Card",
                    payment_gateway_bank: req.body.payment_gateway_bank || "Unknown",
                    payer_email: req.body.payer_email || "Unknown",
                    payer_mobile: req.body.payer_mobile || "Unknown",
                    payer_device: req.body.payer_device || "Unknown",
                    payee_id: req.body.payee_id || "Unknown",
                    is_fraud_predicted: prediction.is_fraud === 1
                });

                transaction.save();
                res.json({ is_fraud: prediction.is_fraud === 1 });
            } catch (err) {
                console.error("Error parsing Python output:", err);
                res.status(500).json({ error: "Invalid response from model" });
            }
        })
        .catch(err => {
            console.error("Python script error:", err);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        });
};

const getFraudStats = async (req, res) => {
    try {
        const totalTransactions = await Transaction.countDocuments();
        const fraudulentTransactions = await Transaction.countDocuments({ is_fraud_predicted: true });

        const fraudPercentage = totalTransactions > 0 
            ? (fraudulentTransactions / totalTransactions) * 100 
            : 0;

        res.json({
            totalTransactions,
            fraudulentTransactions,
            fraudPercentage: parseFloat(fraudPercentage.toFixed(2)),
            lastUpdated: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { detectFraud, getFraudStats };
