const FraudReport = require("../models/report");
const Transaction = require("../models/Transaction");

const reportFraud = async (req, res) => {
    try {
        const { transaction_id, reporting_entity_id, fraud_details } = req.body;

        // Validate if transaction exists
        const transaction = await Transaction.findOne({ transaction_id });
        if (!transaction) {
            return res.status(404).json({
                transaction_id,
                reporting_acknowledged: false,
                failure_code: 404
            });
        }

        // Store fraud report
        const fraudReport = new FraudReport({
            transaction_id,
            reporting_entity_id,
            fraud_details,
            is_fraud_reported: true
        });

        await fraudReport.save();

        return res.status(201).json({
            transaction_id,
            reporting_acknowledged: true,
            failure_code: 0
        });

    } catch (error) {
        return res.status(500).json({
            transaction_id: req.body.transaction_id,
            reporting_acknowledged: false,
            failure_code: 500,
            error: error.message
        });
    }
};

module.exports = { reportFraud };
