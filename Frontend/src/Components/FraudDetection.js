import React, { useState } from "react";
import axios from "axios";
import { Search, Upload, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const FraudDetection = () => {
  const [transaction, setTransaction] = useState({
    id: "",
    payer: "",
    payee: "",
    amount: "",
    mode: "",
  });
  const [fraudResult, setFraudResult] = useState(null);
  const [batchResult, setBatchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleTransactionChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const checkFraud = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/api/detect", {
        transaction_id: transaction.id,
        payer_email: transaction.payer,
        payee_id: transaction.payee,
        transaction_amount: parseFloat(transaction.amount),
        transaction_channel: transaction.mode,
        time: new Date().toISOString(),
      });

      setFraudResult({
        status: response.data.is_fraud ? "Fraud" : "Safe",
        score: response.data.fraud_score || 50,
        reason: response.data.reason || "Analysis completed",
      });
    } catch (error) {
      console.error("Error checking fraud:", error);
      setError(`Failed to check fraud: ${error.response?.status === 404 ? "API endpoint not found" : error.message}`);
      setFraudResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const transactions = JSON.parse(e.target.result);
        const response = await axios.post("http://localhost:5000/api/detectFraudBatch", { transactions });
        setBatchResult(response.data);
      } catch (error) {
        console.error("Error processing batch upload:", error);
        setError(`Failed to process batch: ${error.response?.status === 404 ? "API endpoint not found" : error.message}`);
        setBatchResult([]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Fraud Detection</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-2xl mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Single Transaction Check */}
      <div className="bg-white shadow rounded p-4 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">Single Transaction Check</h2>
        <input className="border rounded px-4 py-2 w-full mb-2" name="id" placeholder="Transaction ID" onChange={handleTransactionChange} />
        <input className="border rounded px-4 py-2 w-full mb-2" name="payer" placeholder="Payer ID" onChange={handleTransactionChange} />
        <input className="border rounded px-4 py-2 w-full mb-2" name="payee" placeholder="Payee ID" onChange={handleTransactionChange} />
        <input className="border rounded px-4 py-2 w-full mb-2" name="amount" placeholder="Amount" type="number" onChange={handleTransactionChange} />
        <select className="border rounded px-4 py-2 w-full mb-2" name="mode" onChange={handleTransactionChange}>
          <option value="">Select Payment Mode</option>
          <option value="mobile">Mobile</option>
          <option value="WEB">Web</option>
          <option value="w">Wallet</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={checkFraud} disabled={loading}>
          {loading ? "Checking..." : "Check Fraud"}
        </button>
        {fraudResult && (
          <div className="mt-4 p-3 bg-gray-200 rounded">
            <p>Status: {fraudResult.status}</p>
            <p>Fraud Score: {fraudResult.score}</p>
            <p>Reason: {fraudResult.reason}</p>
          </div>
        )}
      </div>

      {/* Batch Transaction Check */}
      <div className="bg-white shadow rounded p-4 w-full max-w-2xl mt-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center"><Upload size={20} className="mr-2" /> Batch Transaction Check</h2>
        <input type="file" className="border rounded px-4 py-2 w-full" accept="application/json" onChange={handleBatchUpload} />
        {loading && <p className="mt-2 text-blue-500">Processing batch file...</p>}
        {batchResult.length > 0 && (
          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Score</th>
                <th className="border p-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {batchResult.map((r) => (
                <tr key={r.id} className="text-center">
                  <td className="border p-2">{r.id}</td>
                  <td className={`border p-2 ${r.status === "Fraud" ? "text-red-500" : "text-green-500"}`}>{r.status}</td>
                  <td className="border p-2">{r.score}</td>
                  <td className="border p-2">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link to='/dashboard'>
        <button className="font-bold px-3 py-2 rounded-md transition bg-black text-white mt-6">Return to Dashboard</button>
      </Link>
    </div>
  );
};

export default FraudDetection;
