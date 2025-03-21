const Transaction = require("../models/Transaction");

// Fetch all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ transaction_date: -1 });
        
        return res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Fetch a transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id;

        const transaction = await Transaction.findOne({ transaction_id: transactionId });
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            transaction
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
};

module.exports = { getAllTransactions, getTransactionById };
