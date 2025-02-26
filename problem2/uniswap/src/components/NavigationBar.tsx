// NavigationBar.tsx
import React from "react";

interface NavigationBarProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  selectedTab,
  onTabChange,
}) => {
  const tabs = ["swap","prices"];

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
    </nav>
  );
};

export default NavigationBar;
