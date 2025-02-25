// missing useState,useEffect and useMemo library from react after installing the react library
interface WalletBalance {
    currency: string;
    amount: number;
    // blockchain string is used but not declared
  }
  // currency and amount is repeated can use extend function to prevent redeclaring
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }
  // missing class datasource API tused to pull the pricelist data
  class Datasource {
    // TODO: Implement datasource class
  }
  // missing the import of BoxProps library from material-ui after installing the material-ui library
  interface Props extends BoxProps {
  
  }
  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    // missing function
    const balances = useWalletBalances();
      const [prices, setPrices] = useState({});
  
    useEffect(() => {
      const datasource = new Datasource("https://interview.switcheo.com/prices.json");
      datasource.getPrices().then(prices => {
        setPrices(prices);
      }).catch(error => {
        // should be console.error not console.err
        console.err(error);
      });
    }, []);

      const getPriority = (blockchain: any): number => {
        switch (blockchain) {
          case 'Osmosis':
            return 100
          case 'Ethereum':
            return 50
          case 'Arbitrum':
            return 30
          case 'Zilliqa':
            return 20
          case 'Neo':
            return 20
          default:
            return -99
        }
      }
  
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            // lhsPriority is used but not declared should use balancePriority instead
            if (lhsPriority > -99) {
               if (balance.amount <= 0) {
                 return true;
               }
            }
            return false
          }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
              const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
              return -1;
            } else if (rightPriority > leftPriority) {
              return 1;
            }
      });
    }, [balances, prices]); // sortedBalances are being ran when prices are being updated even though it is never used
  
    // .map recomputes on every render and there is no specifying decimal points for .toFixed()
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    })
  
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        // missing WalletRow component import
        <WalletRow 
          className={classes.row}
          // using index may cause unnecessary re-renders, instead should use balance.currency instead as it is a unique identifyer 
          key={index}
          amount={balance.amount}
          usdValue={usdValue} // missing specific decimal points
          formattedAmount={balance.formatted}
        />
      )
    })
  
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }