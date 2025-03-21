# Fraud Detection API

A RESTful API for a fraud detection system built with Express.js and MongoDB. This API allows for real-time fraud detection, transaction management, and fraud reporting.

## Setup

1. Ensure you have Node.js and MongoDB installed on your system.

2. Clone this repository and navigate to the project directory.

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fraud-detect
   ```
   
   Note: Update the MONGO_URI with your MongoDB connection string if needed.

## Running the Application

- To start the server in development mode with auto-restart:
  ```
  npm run dev
  ```

- To start the server in production mode:
  ```
  npm start
  ```

## API Endpoints Reference

### Transaction Management

#### GET `/api/transactions/transactions`
Retrieves all transactions in the system.

**Response Format:**
```json
{
  "success": true,
  "transactions": [
    {
      "transaction_id": "tx_123456789",
      "transaction_date": "2023-01-01T12:00:00.000Z",
      "transaction_amount": 500.00,
      "transaction_channel": "web",
      "transaction_payment_mode": "Card",
      "payment_gateway_bank": "Example Bank",
      "payer_email": "user@example.com",
      "payer_mobile": "1234567890",
      "payer_device": "iPhone",
      "payee_id": "merchant_123",
      "is_fraud_predicted": false,
      "fraud_source": null,
      "fraud_reason": null,
      "fraud_score": null,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ]
}
```

#### GET `/api/transactions/transactions/:id`
Retrieves a specific transaction by ID.

**Response Format (Success):**
```json
{
  "success": true,
  "transaction": {
    "transaction_id": "tx_123456789",
    "transaction_date": "2023-01-01T12:00:00.000Z",
    "transaction_amount": 500.00,
    "transaction_channel": "web",
    "transaction_payment_mode": "Card",
    "payment_gateway_bank": "Example Bank",
    "payer_email": "user@example.com",
    "payer_mobile": "1234567890",
    "payer_device": "iPhone",
    "payee_id": "merchant_123",
    "is_fraud_predicted": false,
    "fraud_source": null,
    "fraud_reason": null,
    "fraud_score": null,
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

**Response Format (Not Found):**
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

### Fraud Detection

#### POST `/api/transactions/detect`
Analyzes a transaction to detect potential fraud using an AI model and stores the transaction.

**Request Body:**
```json
{
  "transaction_id": "tx_123456789",
  "transaction_date": "2023-01-01T12:00:00.000Z",
  "transaction_amount": 500.00,
  "transaction_channel": "web",
  "transaction_payment_mode": "Card",
  "payment_gateway_bank": "Example Bank",
  "payer_email": "user@example.com",
  "payer_mobile": "1234567890",
  "payer_device": "iPhone",
  "payee_id": "merchant_123"
}
```

**Response Format:**
```json
{
  "transaction_id": "tx_123456789",
  "is_fraud": false,
  "fraud_source": null,
  "fraud_reason": null,
  "fraud_score": 0.05
}
```

#### GET `/api/transactions/stats`
Retrieves fraud detection statistics.

**Response Format:**
```json
{
  "totalTransactions": 100,
  "fraudulentTransactions": 5,
  "fraudPercentage": 5.00,
  "lastUpdated": "2023-01-01T12:00:00.000Z"
}
```

### Fraud Reporting

#### POST `/api/transactions/report`
Allows users or merchants to report a transaction as fraudulent.

**Request Body:**
```json
{
  "transaction_id": "tx_123456789",
  "reporting_entity_id": "user_123",
  "fraud_details": "Unauthorized transaction. I did not make this purchase."
}
```

**Response Format (Success):**
```json
{
  "transaction_id": "tx_123456789",
  "reporting_acknowledged": true,
  "failure_code": 0
}
```

**Response Format (Error):**
```json
{
  "transaction_id": "tx_123456789",
  "reporting_acknowledged": false,
  "failure_code": 404
}
```

### Batch Processing

#### POST `/api/transactions/batch-fraud-detection`
Processes multiple transactions for fraud detection in a single request.

**Request Body:**
```json
{
  "transactions": [
    {
      "id": "tx_123456789",
      "transaction_date": "2023-01-01T12:00:00.000Z",
      "transaction_amount": 500.00,
      "transaction_channel": "web",
      "transaction_payment_mode": "Card",
      "payment_gateway_bank": "Example Bank",
      "payer_email": "user@example.com",
      "payer_mobile": "1234567890",
      "payer_device": "iPhone",
      "payee_id": "merchant_123"
    },
    {
      "id": "tx_987654321",
      "transaction_date": "2023-01-02T12:00:00.000Z",
      "transaction_amount": 1200.00,
      "transaction_channel": "mobile",
      "transaction_payment_mode": "UPI",
      "payment_gateway_bank": "Other Bank",
      "payer_email": "another@example.com",
      "payer_mobile": "0987654321",
      "payer_device": "Android",
      "payee_id": "merchant_456"
    }
  ]
}
```

**Response Format:**
```json
{
  "results": [
    {
      "transaction_id": "tx_123456789",
      "is_fraud": false,
      "fraud_source": null,
      "fraud_reason": null,
      "fraud_score": 0.05
    },
    {
      "transaction_id": "tx_987654321",
      "is_fraud": true,
      "fraud_source": "amount",
      "fraud_reason": "Unusually high transaction amount",
      "fraud_score": 0.75
    }
  ]
}
```

## Data Models

### Transaction Model
```json
{
  "transaction_id": "String (required, unique)",
  "transaction_date": "Date (required)",
  "transaction_amount": "Number (required)",
  "transaction_channel": "String enum: ['web', 'mobile', 'other'] (required)",
  "transaction_payment_mode": "String enum: ['Card', 'UPI', 'NEFT', 'Other'] (required)",
  "payment_gateway_bank": "String",
  "payer_email": "String (required)",
  "payer_mobile": "String (required)",
  "payer_device": "String",
  "payee_id": "String (required)",
  "is_fraud_predicted": "Boolean (default: false)",
  "fraud_source": "String (default: null)",
  "fraud_reason": "String (default: null)",
  "fraud_score": "Number (default: null)"
}
```

### Fraud Report Model
```json
{
  "transaction_id": "String (required)",
  "reporting_entity_id": "String (required)",
  "fraud_details": "String (required)",
  "is_fraud_reported": "Boolean (default: true)"
}
```

## Technical Implementation

The system uses a combination of rule-based fraud detection and an AI model (Python-based) to analyze transactions. Key components include:

1. **Express.js Backend**: Handles API requests, database operations, and communicates with the fraud detection model
2. **MongoDB Database**: Stores transaction data and fraud reports
3. **Python ML Model**: A separate process that performs advanced fraud detection analysis

## Future Enhancements

- User authentication and authorization
- Advanced fraud detection algorithms
- Multi-factor authentication for high-risk transactions
- Real-time fraud alerts
- Transaction analytics dashboard 