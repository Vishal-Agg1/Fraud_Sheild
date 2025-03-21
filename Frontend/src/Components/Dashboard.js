import React, { useState, useEffect } from "react";
import { Search, LineChart as LineChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fraudTrends, setFraudTrends] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchFraudTrends();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/transactions");
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
        setFilteredData(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchFraudTrends = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fraud-trends");
      const data = await response.json();
      if (data.success) {
        setFraudTrends(data.trends);
      }
    } catch (error) {
      console.error("Error fetching fraud trends:", error);
    }
  };

  const handleSearch = () => {
    setFilteredData(transactions.filter((t) => t.transaction_id.includes(search)));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Fraud Detection Dashboard</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center w-full max-w-2xl">
        <input 
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-3/4" 
          placeholder="Search by Transaction ID" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center" onClick={handleSearch}>
          <Search size={16} className="mr-2" /> Search
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-white shadow rounded p-4 w-full max-w-4xl">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Payer</th>
              <th className="border p-2">Payee</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Fraud</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((t) => (
              <tr key={t.transaction_id} className="text-center">
                <td className="border p-2">{t.transaction_id}</td>
                <td className="border p-2">{t.payer}</td>
                <td className="border p-2">{t.payee}</td>
                <td className="border p-2">${t.amount}</td>
                <td className="border p-2">{t.transaction_date}</td>
                <td className={`border p-2 ${t.fraud ? "text-red-500" : "text-green-500"}`}>{t.fraud ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fraud Trends Graph */}
      <div className="bg-white shadow rounded p-4 mt-6 w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <LineChartIcon size={20} className="mr-2" /> Fraud Trends Over Time
        </h2>
        <div className="w-full overflow-x-auto flex justify-center">
          <div className="w-full max-w-[90vw] md:max-w-[600px]">
            <LineChart width={600} height={300} data={fraudTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="frauds" stroke="#ff0000" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
