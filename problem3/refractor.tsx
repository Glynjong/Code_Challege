import React, { useState, useEffect, useMemo } from "react";
import { BoxProps } from "@mui/material";
import WalletRow from "../components/WalletRow"; // assuming there is a component called WalletRow under components file
import { useWalletBalances } from "../hooks/useWalletBalances"; // assuming there is a hook with the useWalletBalances function udner the hooks file
// added imports for the missing library
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // added the missing blockchain string
}

interface FormattedWalletBalance extends WalletBalance {
  // used extends to prevent redeclaring of currency and amount
  formatted: string;
}

// added the datasource class to call the API to fetch the prices data
class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching prices:", error);
      return {}; // Return an empty object to prevent application crashes
    }
  }
}

// declared the BoxProps import library
interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  // added the hook library to call this function
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");

    datasource.getPrices()
      .then(setPrices)
      .catch(error => console.error(error)); // changed from console.err to console.error
  }, []);

  // refractored the switch case into a priority map that takes in the string and returns the piority value based on the string name and returns -99 if it does not exist 
  const getPriority = (blockchain: string): number => {
    const priorityMap: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorityMap[blockchain] ?? -99;
  };

  // refracted the code such that it will still return the sortedBalances based on the thier priority from the getPriority function everytime balances updates
  const sortedBalances = useMemo(() => { // added the useMemo library from react
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0; // used the balancePriorty instead of lhsPriority
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
  }, [balances]); // removed prices to prevent it from calling this function even though it is never used.

  // updated formattedBalances to useMemo to update everytime sortedBalances is being updated and specified the decimal points for consistency
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);


  const rows = formattedBalances.map((balance: FormattedWalletBalance) => { // using formattedBalances instead since of the sortedBalances to prevent recalculations
    const usdValue = prices[balance.currency] ? prices[balance.currency] * balance.amount : 0; // added a safety check that returns the value 0 if the prices[balance.currency] is missing
    return (
      <WalletRow // added the missing library import
        key={balance.currency} // Use currency as a stable key instead of index
        amount={balance.amount}
        usdValue={usdValue.toFixed(2)} // specified the 2 d.p
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

