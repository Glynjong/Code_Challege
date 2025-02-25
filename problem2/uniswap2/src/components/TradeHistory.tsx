// TradeHistory.tsx
import React from "react";

interface Trade {
  id: string;
  date: string;
  pair: string;
  amount: string;
  status: string;
}

const dummyTrades: Trade[] = [
  { id: "1", date: "2025-01-01", pair: "ETH/USDC", amount: "1 ETH", status: "Completed" },
  { id: "2", date: "2025-01-02", pair: "ETH/DAI", amount: "0.5 ETH", status: "Completed" },
];

const TradeHistory: React.FC = () => {
  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">Trade History</h2>
      <ul className="divide-y divide-gray-700">
        {dummyTrades.map((trade) => (
          <li key={trade.id} className="py-2 flex justify-between text-sm">
            <span>{trade.date}</span>
            <span>{trade.pair}</span>
            <span>{trade.amount}</span>
            <span>{trade.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradeHistory;
