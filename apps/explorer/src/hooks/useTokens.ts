import { useSDK, useTokenBalance } from "@thirdweb-dev/react";
import React from "react";
import useSWR from "swr";

export interface TokenMetaData {
  mint: string; // Ethereum contract address instead of PublicKey
  name: string;
  symbol: string;
  image?: string;
  decimals: number;
}

export interface ParsedTokenAccount {
  mint: string; // Ethereum contract address instead of PublicKey
  amount: number;
  decimals: number;
}

/**
 * Parse the token account information.
 */
const parseTokenAccount = (tokenBalance: any): ParsedTokenAccount => {
  return {
    mint: tokenBalance.contractAddress, // Ethereum address of the token
    amount: Number(tokenBalance.value.displayValue),
    decimals: Number(tokenBalance.value.decimals),
  };
};

/**
 * Fetch token accounts for a given wallet address using Thirdweb SDK.
 */
async function fetchTokenAccounts(sdk: any, owner: string) {
  if (!sdk) return [];

  const tokenBalances = await sdk.wallet.getTokenBalances(owner);
  return tokenBalances.map(parseTokenAccount);
}

/**
 * @returns A list of user-owned tokens on Optimism
 */
export function useTokenAccountsByOwner(owner: string) {
  const sdk = useSDK(); // Use Thirdweb SDK to fetch token balances
  const { data = [] } = useSWR(owner ? `token-accounts-${owner}` : null, () => fetchTokenAccounts(sdk, owner));

  return React.useMemo(
    () =>
      [...data.sort((a, b) => {
        const amountDiff = b.amount - a.amount;
        if (amountDiff) return amountDiff;
        return a.mint > b.mint ? 1 : -1; // Sorting by mint address if amounts are equal
      }).filter((a) => a.amount > 0)],
    [data]
  );
}
