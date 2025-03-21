const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },
    transaction_date: { type: Date, required: true },
    transaction_amount: { type: Number, required: true },
    transaction_channel: { type: String, enum: ["web", "mobile", "other"], required: true },
    transaction_payment_mode: { type: String, enum: ["Card", "UPI", "NEFT", "Other"], required: true },
    payment_gateway_bank: { type: String },

    payer_email: { type: String, required: true },
    payer_mobile: { type: String, required: true },
    payer_device: { type: String },


    payee_id: { type: String, required: true },

    is_fraud_predicted: { type: Boolean, default: false },
}, );

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
