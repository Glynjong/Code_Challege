// NavigationBar.tsx
import React from "react";

interface NavigationBarProps {
  walletAddress?: string;
  onConnect: () => void;
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  walletAddress,
  onConnect,
  selectedTab,
  onTabChange,
}) => {
  const tabs = ["swap", "pool", "vote", "charts", "prices"];

  const displayAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "";

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800">
      <div className="flex items-center space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`capitalize text-white hover:text-purple-400 ${
              selectedTab === tab ? "font-bold border-b-2 border-purple-500" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {walletAddress ? (
          <span className="px-4 py-2 bg-purple-600 rounded">
            {displayAddress}
          </span>
        ) : (
          <button
            onClick={onConnect}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
          >
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
