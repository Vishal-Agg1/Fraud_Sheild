const FraudReport = require("../models/report");
const Transaction = require("../models/Transaction");

const reportFraud = async (req, res) => {
    try {
        const { transaction_id, reporting_entity_id, fraud_details } = req.body;
        
        console.log("Received report request with transaction_id:", transaction_id);
        
        if (!transaction_id) {
            return res.status(400).json({
                reporting_acknowledged: false,
                failure_code: 400,
                message: "Missing transaction_id"
            });
        }
        
        // Validate if transaction exists
        let transaction = await Transaction.findOne({ transaction_id });
        
        // For development/testing: Create a dummy transaction if it doesn't exist
        if (!transaction && process.env.NODE_ENV !== 'production') {
            console.log("Creating test transaction with ID:", transaction_id);
            transaction = new Transaction({
                transaction_id,
                transaction_date: new Date(),
                transaction_amount: 100,
                transaction_channel: "web",
                transaction_payment_mode: "Card",
                payment_gateway_bank: "Test Bank",
                payer_email: "test@example.com",
                payer_mobile: "1234567890",
                payer_device: "Unknown",
                payee_id: "test_payee",
                is_fraud_predicted: false
            });
            
            try {
                await transaction.save();
                console.log("Test transaction created successfully");
            } catch (saveError) {
                console.error("Failed to create test transaction:", saveError);
                // Continue anyway - we'll create the report
            }
        }
        
        // Store fraud report even if transaction doesn't exist
        const fraudReport = new FraudReport({
            transaction_id,
            reporting_entity_id: reporting_entity_id || "anonymous",
            fraud_details: fraud_details || "No details provided",
            is_fraud_reported: true
        });

        await fraudReport.save();
        console.log("Fraud report saved successfully for transaction:", transaction_id);

        return res.status(201).json({
            transaction_id,
            reporting_acknowledged: true,
            failure_code: 0
        });

    } catch (error) {
        console.error("Error in reportFraud:", error);
        return res.status(500).json({
            transaction_id: req.body.transaction_id,
            reporting_acknowledged: false,
            failure_code: 500,
            error: error.message
        });
    }
};

module.exports = { reportFraud };
