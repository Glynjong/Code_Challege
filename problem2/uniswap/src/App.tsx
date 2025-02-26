// App.tsx
import React, { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import SwapForm from "./components/SwapForm";
import CurrencyPrices from "./components/CurrencyPrices";

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("swap");

  const renderContent = () => {
    switch (selectedTab) {
      case "swap":
        return <SwapForm />;
      case "prices":
        return <CurrencyPrices />;
      default:
        return <SwapForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationBar
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <main className="p-4">{renderContent()}</main>
    </div>
  );
};

export default App;
