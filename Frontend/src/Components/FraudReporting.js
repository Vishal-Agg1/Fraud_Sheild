import React, { useState } from "react";
import axios from "axios";
import { Search, Upload, Settings, Flag } from "lucide-react";
import { Link } from "react-router-dom";

const FraudReporting = () => {
  const [transaction, setTransaction] = useState({ id: "", payer: "", payee: "", amount: "", mode: "" });
  const [fraudResult, setFraudResult] = useState(null);
  const [fraudReports, setFraudReports] = useState([]);
  const [report, setReport] = useState({ id: "", entity: "User", details: "" });
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5000/api";

  const handleTransactionChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleReportChange = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };

  const checkFraud = async () => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/detect`, transaction);
      setFraudResult(response.data);
    } catch (error) {
      console.error("Error checking fraud:", error);
      setError(`Failed to check fraud: ${error.response?.status === 404 ? "API endpoint not found" : error.message}`);
    }
  };

  const submitFraudReport = async () => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/report`, {
        transaction_id: report.id,
        reporting_entity_id: report.entity,
        fraud_details: report.details,
      });
      
      if (response.data.reporting_acknowledged) {
        setFraudReports([...fraudReports, { ...report, date: new Date().toISOString().split("T")[0], status: "Pending" }]);
        setReport({ id: "", entity: "User", details: "" });
      }
    } catch (error) {
      console.error("Error reporting fraud:", error);
      setError(`Failed to submit report: ${error.response?.status === 404 ? "API endpoint not found" : error.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Fraud Detection</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-2xl mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded p-4 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">Single Transaction Check</h2>
        <input className="border rounded px-4 py-2 w-full mb-2" name="id" placeholder="Transaction ID" onChange={handleTransactionChange} />
        <input className="border rounded px-4 py-2 w-full mb-2" name="payer" placeholder="Payer ID" onChange={handleTransactionChange} />
        <input className="border rounded px-4 py-2 w-full mb-2" name="payee" placeholder="Payee ID" onChange={handleTransactionChange} />
        <input className="border rounded px-4 py-2 w-full mb-2" name="amount" placeholder="Amount" type="number" onChange={handleTransactionChange} />
        <select className="border rounded px-4 py-2 w-full mb-2" name="mode" onChange={handleTransactionChange}>
          <option value="">Select Payment Mode</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={checkFraud}>Check Fraud</button>
        {fraudResult && (
          <div className="mt-4 p-3 bg-gray-200 rounded">
            <p>Status: {fraudResult.status}</p>
            <p>Fraud Score: {fraudResult.score}</p>
            <p>Reason: {fraudResult.reason}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded p-4 w-full max-w-2xl mt-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center"><Flag size={20} className="mr-2" /> Report Fraud</h2>
        <input className="border rounded px-4 py-2 w-full mb-2" name="id" placeholder="Transaction ID" onChange={handleReportChange} value={report.id} />
        <select className="border rounded px-4 py-2 w-full mb-2" name="entity" onChange={handleReportChange} value={report.entity}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <textarea className="border rounded px-4 py-2 w-full mb-2" name="details" placeholder="Fraud Details" onChange={handleReportChange} value={report.details} />
        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={submitFraudReport}>Submit Report</button>
      </div>

      <div className="bg-white shadow rounded p-4 w-full max-w-2xl mt-6">
        <h2 className="text-lg font-semibold mb-2">Reported Frauds</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Transaction ID</th>
              <th className="border p-2">Date Reported</th>
              <th className="border p-2">Reported By</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {fraudReports.map((r, index) => (
              <tr key={index}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.date}</td>
                <td className="border p-2">{r.entity}</td>
                <td className={`border p-2 ${r.status === "Pending" ? "text-orange-500" : "text-green-500"}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to='/dashboard'>
        <button className="font-bold px-3 py-2 rounded-md transition bg-black text-white lg:mt-24 lg:mb-20 lg:ml-[100px]">
          Return to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default FraudReporting;