const Transaction = require("../models/Transaction");

// Fetch all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();

        const formattedTransactions = transactions.map((t) => ({
            transaction_id: t.transaction_id,
            payer: t.payer_email || t.payer_mobile, // Map payer
            payee: t.payee_id, // Rename payee
            amount: t.transaction_amount, // Rename amount
            transaction_date: t.transaction_date,
            fraud: t.is_fraud_predicted
        }));

        return res.status(200).json({ success: true, transactions: formattedTransactions });
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
