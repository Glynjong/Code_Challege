import { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
  const [convertedAmount, setConvertedAmount] = useState("");

  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

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

  const exchangeRate = useMemo(() => {
    if (!tokens[fromToken] || !tokens[toToken]) return "";
    return (tokens[fromToken] / tokens[toToken]).toFixed(6);
  }, [tokens, fromToken, toToken]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (!value || !tokens[fromToken] || !tokens[toToken]) {
      setConvertedAmount("");
      return;
    }
    const numericAmount = parseFloat(value);
    if (isNaN(numericAmount)) {
      setConvertedAmount("");
      return;
    }
    setConvertedAmount(
      ((numericAmount * tokens[fromToken]) / tokens[toToken]).toFixed(4)
    );
  };

  const handleSwap = () => {
    // Swap the tokens
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    // Recalculate the converted amount based on the new tokens
    if (amount && tokens[toToken] && tokens[fromToken]) {
      const newConvertedAmount =
        parseFloat(amount) * (tokens[toToken] / tokens[fromToken]);
      setConvertedAmount(newConvertedAmount.toFixed(4));
    }
  };

  const openFirstConfirm = () => {
    setIsFirstConfirmOpen(true);
  };

  const openFinalConfirm = () => {
    setIsFirstConfirmOpen(false);
    setIsFinalConfirmOpen(true);
  };

  const openCancelConfirm = () => {
    setIsFirstConfirmOpen(false);
    setIsCancelConfirmOpen(true);
  };

  const executeSwap = () => {
    setIsFinalConfirmOpen(false);
    alert(
      `Trade Executed: ${amount} ${fromToken} → ${convertedAmount} ${toToken}`
    );
    setAmount("");
    setConvertedAmount("");
  };

  // Calculate USD values
  const fromTokenUSDValue = useMemo(() => {
    if (!amount || !tokens[fromToken]) return "";
    return (parseFloat(amount) * tokens[fromToken]).toFixed(2);
  }, [amount, tokens, fromToken]);

  const toTokenUSDValue = useMemo(() => {
    if (!convertedAmount || !tokens[toToken]) return "";
    return (parseFloat(convertedAmount) * tokens[toToken]).toFixed(2);
  }, [convertedAmount, tokens, toToken]);

  // Function to get token image URL
  const getTokenImageUrl = (tokenSymbol: string) => {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${tokenSymbol}.svg`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 mx-4 pt-4 sm:pt-8 md:pt-12">
      <div className="bg-gray-800 text-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        {" "}
        {/* Increased max-width for horizontal layout */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          Swap
        </h2>
        {/* Horizontal layout for larger screens */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          {/* From Section */}
          <div className="flex-1 mb-4 sm:mb-6">
            <label className="block text-sm sm:text-base font-medium mb-1 sm:mb-2">
              From
            </label>
            <div className="relative">
              <select
                className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg appearance-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
              >
                {Object.keys(tokens).map((token) => (
                  <option key={token} value={token}>
                    <div className="flex items-center">
                      <img
                        src={getTokenImageUrl(token)}
                        alt={token}
                        className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                      />
                      {token}
                    </div>
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="fill-current h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12l-6-6h12z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center mt-2 sm:mt-3">
              <img
                src={getTokenImageUrl(fromToken)}
                alt={fromToken}
                className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
              />
              <span>{fromToken}</span>
            </div>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full p-2 sm:p-3 mt-2 sm:mt-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {fromTokenUSDValue && (
              <div className="text-sm text-gray-400 mt-1 sm:mt-2">
                ≈ ${fromTokenUSDValue} USD
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-2 sm:my-4 md:my-0 md:items-center">
            <button
              className="text-gray-400 hover:text-white transition-colors duration-200"
              onClick={handleSwap}
            >
              <FaExchangeAlt className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>

          {/* To Section */}
          <div className="flex-1 mb-4 sm:mb-6">
            <label className="block text-sm sm:text-base font-medium mb-1 sm:mb-2">
              To
            </label>
            <div className="relative">
              <select
                className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg appearance-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
              >
                {Object.keys(tokens).map((token) => (
                  <option key={token} value={token}>
                    <div className="flex items-center">
                      <img
                        src={getTokenImageUrl(token)}
                        alt={token}
                        className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                      />
                      {token}
                    </div>
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="fill-current h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12l-6-6h12z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center mt-2 sm:mt-3">
              <img
                src={getTokenImageUrl(toToken)}
                alt={toToken}
                className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
              />
              <span>{toToken}</span>
            </div>
            <input
              type="text"
              placeholder="Converted amount"
              className="w-full p-2 sm:p-3 mt-2 sm:mt-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              value={convertedAmount}
              readOnly
            />
            {toTokenUSDValue && (
              <div className="text-sm text-gray-400 mt-1 sm:mt-2">
                ≈ ${toTokenUSDValue} USD
              </div>
            )}
          </div>
        </div>
        {/* Exchange Rate and Confirm Button */}
        <div className="text-gray-400 text-sm text-center my-2 sm:my-3">
          <h3 className="text-lg font-bold mb-1">Exchange Rate:</h3>
          {exchangeRate && (
            <p>
              1 {fromToken} = {exchangeRate} {toToken}
            </p>
          )}
        </div>
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 sm:p-3 rounded-lg font-bold text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={openFirstConfirm}
          disabled={!amount || !convertedAmount}
        >
          Confirm Swap
        </button>
      </div>
      <Transition appear show={isFirstConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClose={() => setIsFirstConfirmOpen(false)}
        >
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center">
          <img src="./src/assets/exclamation-mark-in-a-circle-svgrepo-com.svg" alt="Alert" className="w-20 h-20 mx-auto mb-4" />
            <Dialog.Title className="text-lg font-bold text-white">
              Confirm Swap
            </Dialog.Title>
            <p className="text-gray-300">
              Are you sure you want to swap {amount} {fromToken} for{" "}
              {convertedAmount} {toToken}?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                onClick={openFinalConfirm}
              >
                Yes, Confirm
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                onClick={openCancelConfirm}
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isFinalConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClose={() => setIsFinalConfirmOpen(false)}
        >
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center">
          <img src="./src/assets/tick-circle-svgrepo-com.svg" alt="Swap Confirmed" className="w-20 h-20 mx-auto mb-4" />
            <Dialog.Title className="text-lg font-bold text-white">
              Swap Confirmed
            </Dialog.Title>
            <p className="text-gray-300">
              Your swap of {amount} {fromToken} for {convertedAmount} {toToken}{" "}
              has been executed.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              onClick={executeSwap}
            >
              Close
            </button>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isCancelConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClose={() => setIsCancelConfirmOpen(false)}
        >
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center">
          <img src="./src/assets/cancel-svgrepo-com.svg" alt="Swap Cancel" className="w-20 h-20 mx-auto mb-4" />
            <Dialog.Title className="text-lg font-bold text-white">
              Swap Cancelled
            </Dialog.Title>
            <p className="text-gray-300">Your swap has been cancelled.</p>
            <button
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              onClick={() => setIsCancelConfirmOpen(false)}
            >
              Close
            </button>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SwapForm;
