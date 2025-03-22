const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testEndpoints() {
  try {
    console.log('Testing API endpoints...');
    
    // Test root endpoint
    try {
      const rootResponse = await axios.get(API_URL.replace('/api', ''));
      console.log('Root endpoint:', rootResponse.status, rootResponse.data);
    } catch (error) {
      console.error('Root endpoint error:', error.message);
    }
    
    // Test /api/stats endpoint
    try {
      const statsResponse = await axios.get(`${API_URL}/stats`);
      console.log('Stats endpoint:', statsResponse.status, statsResponse.data);
    } catch (error) {
      console.error('Stats endpoint error:', error.message);
    }
    
    // Test /api/fraud-trends endpoint
    try {
      const trendsResponse = await axios.get(`${API_URL}/fraud-trends`);
      console.log('Fraud trends endpoint:', trendsResponse.status, trendsResponse.data);
    } catch (error) {
      console.error('Fraud trends endpoint error:', error.message);
    }
    
    // Test creating a transaction
    try {
      const detectResponse = await axios.post(`${API_URL}/detect`, {
        transaction_id: `test_${Date.now()}`,
        transaction_amount: 100,
        transaction_channel: 'web',
        payer_email: 'test@example.com',
        payer_mobile: '1234567890',
        payee_id: 'test_merchant',
        time: new Date().toISOString()
      });
      console.log('Detect endpoint:', detectResponse.status, detectResponse.data);
      
      // Test reporting with the created transaction
      const reportResponse = await axios.post(`${API_URL}/report`, {
        transaction_id: detectResponse.data.transaction_id,
        reporting_entity_id: 'test_user',
        fraud_details: 'Test fraud report'
      });
      console.log('Report endpoint:', reportResponse.status, reportResponse.data);
    } catch (error) {
      console.error('Transaction test error:', error.message);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEndpoints(); 