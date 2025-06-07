// src/App.jsx
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const addExpense = () => {
    if (!amount || !category) return;
    const newExpense = {
      date: new Date().toISOString().slice(0, 10),
      amount: parseFloat(amount),
      category,
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setAmount("");
    setCategory("");
  };

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  const categoryTotals = monthlyExpenses.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto bg-white text-black">
      <h1 className="text-2xl font-bold text-center mb-4">Daily Expense Tracker</h1>

      <div className="space-y-2 mb-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category (e.g., Food, Travel)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addExpense}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Add Expense
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Monthly Analysis</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center">No data for this month.</p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">All Expenses (This Month)</h3>
        <ul className="mt-2 space-y-1">
          {monthlyExpenses.map((exp, idx) => (
            <li key={idx} className="text-sm border-b py-1">
              {exp.date}: ₹{exp.amount.toFixed(2)} - {exp.category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
