const mongoose = require("mongoose");

const fraudReportSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true },
    reporting_entity_id: { type: String, required: true },
    fraud_details: { type: String, required: true },
    is_fraud_reported: { type: Boolean, default: true }
}, { timestamps: true });

const FraudReport = mongoose.model("FraudReport", fraudReportSchema);
module.exports = FraudReport;
