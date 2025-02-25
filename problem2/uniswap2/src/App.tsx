// App.tsx
import React, { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import SwapForm from "./components/SwapForm";
import LiquidityPool from "./components/LiquidityPool";
import TradeHistory from "./components/TradeHistory";
import CurrencyPrices from "./components/CurrencyPrices";

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("swap");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    // Add actual wallet connection logic here (e.g. via ethers.js)
    setWalletAddress("0x1234567890abcdef1234567890abcdef12345678");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "swap":
        return <SwapForm />;
      case "pool":
        return <LiquidityPool />;
      case "vote":
        return <div className="p-6">Vote feature coming soon</div>;
      case "charts":
        return <div className="p-6">Charts coming soon</div>;
      case "prices":
        return <CurrencyPrices />;
      default:
        return <SwapForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationBar
        walletAddress={walletAddress || undefined}
        onConnect={connectWallet}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <main className="p-4">{renderContent()}</main>
    </div>
  );
};

export default App;
