import { AlphaRouter } from "@uniswap/smart-order-router";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { ethers, BigNumber } from "ethers";
import JSBI from "jsbi";

const chainId = 1; // Ethereum Mainnet
const provider = new ethers.providers.Web3Provider(window.ethereum);
const router = new AlphaRouter({ chainId, provider });

export const getPrice = async (amount: number, slippage: number, deadline: number, walletAddress: string) => {
  const wei = ethers.utils.parseUnits(amount.toString(), 18);
  const currencyAmount = CurrencyAmount.fromRawAmount(new Token(chainId, "0xETH_ADDRESS", 18), JSBI.BigInt(wei));

  const route = await router.route(currencyAmount, new Token(chainId, "0xTOKEN_ADDRESS", 18), TradeType.EXACT_INPUT, { recipient: walletAddress, slippageTolerance: new Percent(slippage, 100), deadline });

  return [route.methodParameters.calldata, route.quote.toFixed(6)];
};
