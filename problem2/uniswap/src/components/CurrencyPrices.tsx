import React, { useState, useEffect } from "react";

interface CurrencyPrice {
  currency: string;
  date: string;
  price: number;
}

const API_URL = "https://interview.switcheo.com/prices.json";

// Function to get token image URL
const getTokenImageUrl = (tokenSymbol: string) => {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${tokenSymbol}.svg`;
};

const CurrencyPrices: React.FC = () => {
  const [prices, setPrices] = useState<CurrencyPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data: CurrencyPrice[] = await response.json();
        setPrices(data);
      } catch (err) {
        setError("Error fetching currency prices. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Currency Prices</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-300">
                  Token
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-300">
                  Price (USD)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-300">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {prices.map((item, index) => (
                <tr key={index} className="bg-gray-800 hover:bg-gray-700 transition">
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <img
                      src={getTokenImageUrl(item.currency)}
                      alt={item.currency}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span>{item.currency}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">${item.price.toFixed(4)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-sm">
                    {new Date(item.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrencyPrices;
