import { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, Transition, TransitionChild, DialogTitle } from "@headlessui/react";
import { FaExchangeAlt } from "react-icons/fa";

const API_URL = "https://interview.switcheo.com/prices.json";

interface TokenPrice {
  currency: string;
  price: number;
}

const SwapForm = () => {
  const [tokens, setTokens] = useState<{ [key: string]: number }>({});
  const [loadingTokens, setLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  
  // Memoized conversion calculation
  const convertedAmount = useMemo(() => {
    if (!amount || !tokens[fromToken] || !tokens[toToken]) return "";
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return "";
    const converted = (numericAmount * tokens[fromToken]) / tokens[toToken];
    return converted.toFixed(4);
  }, [amount, tokens, fromToken, toToken]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoadingTokens(true);
      setError("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Network response was not ok");
        const data: TokenPrice[] = await res.json();
        const priceMap: { [key: string]: number } = {};
        data.forEach((item) => {
          priceMap[item.currency] = item.price;
        });
        setTokens(priceMap);
      } catch (err) {
        setError("Error fetching token prices.");
        console.error(err);
      } finally {
        setLoadingTokens(false);
      }
    };

    fetchPrices();
  }, []);

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const confirmSwap = () => {
    setIsOpen(false);
    alert(`Swap Confirmed: ${amount} ${fromToken} → ${convertedAmount} ${toToken}`);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto content-center">
      <h2 className="text-2xl font-bold text-center mb-4">Swap</h2>
      {loadingTokens ? (
        <div className="text-center">Loading token prices...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="fromToken" className="block text-sm mb-1">From</label>
            <div className="relative">
              <select
                id="fromToken"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 appearance-none"
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
              >
                {Object.keys(tokens).map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-white">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M10 12l-6-6h12z" />
                </svg>
              </div>
            </div>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded no-"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>

          <div className="flex justify-center my-2">
            <button className="text-gray-400 hover:text-white text-2xl" onClick={handleSwap}>
              <FaExchangeAlt />
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="toToken" className="block text-sm mb-1">To</label>
            <div className="relative">
              <select
                id="toToken"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 appearance-none"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
              >
                {Object.keys(tokens).map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-white">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M10 12l-6-6h12z" />
                </svg>
              </div>
            </div>
            <input
              type="text"
              placeholder="Converted amount"
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded"
              value={convertedAmount}
              readOnly
            />
          </div>

          <button
            className="w-full bg-purple-600 hover:bg-purple-500 p-3 rounded-lg font-bold disabled:opacity-50"
            onClick={() => setIsOpen(true)}
            disabled={!amount || !convertedAmount}
          >
            Confirm Swap
          </button>
        </>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* Custom overlay */}
              <div className="fixed inset-0 bg-black opacity-30" />
            </TransitionChild>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg">
                <DialogTitle as="h3" className="text-lg font-bold leading-6 text-white">
                  Confirm Swap
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    Swap {amount} {fromToken} for {convertedAmount} {toToken}?
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={confirmSwap}
                  >
                    Yes, Swap
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SwapForm;
