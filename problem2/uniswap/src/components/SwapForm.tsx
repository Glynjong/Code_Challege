import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaExchangeAlt } from "react-icons/fa";
import { ethers } from "ethers";
import { getPrice, runSwap } from "../utils/uniswap";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const SwapForm = () => {
  const [tokens, setTokens] = useState<{ [key: string]: number }>({});
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);

  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((data) => {
        const priceMap: { [key: string]: number } = {};
        data.forEach((item: { currency: string; price: number }) => {
          priceMap[item.currency] = item.price;
        });
        setTokens(priceMap);
      })
      .catch(console.error);
  }, []);

  const handleConversion = async (value: string) => {
    setAmount(value);
    if (tokens[fromToken] && tokens[toToken] && parseFloat(value) > 0) {
      const converted = (parseFloat(value) * tokens[fromToken]) / tokens[toToken];
      setConvertedAmount(converted.toFixed(4));

      // Get Swap Transaction Details
      const [tx] = await getPrice(parseFloat(value), 2, Math.floor(Date.now() / 1000 + 600), address || "");
      setTransaction(tx);
    } else {
      setConvertedAmount("");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Swap</h2>

      {/* Connect Wallet Button */}
      <div className="text-center mb-4">
        {isConnected ? (
          <button className="bg-red-500 px-4 py-2 rounded" onClick={disconnect}>Disconnect</button>
        ) : (
          <button className="bg-blue-500 px-4 py-2 rounded" onClick={connect}>Connect Wallet</button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm">From</label>
        <input type="number" className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1" value={amount} onChange={(e) => handleConversion(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm">To</label>
        <input type="text" className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1" value={convertedAmount} readOnly />
      </div>

      <button className="w-full bg-green-500 p-3 rounded-lg font-bold" onClick={() => setIsOpen(true)}>
        Confirm Swap
      </button>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center z-50 modal">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-bold mb-2">Confirm Swap</h3>
          <p>Swap {amount} {fromToken} for {convertedAmount} {toToken}?</p>
          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={() => runSwap(transaction, address)}>Swap</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SwapForm;
