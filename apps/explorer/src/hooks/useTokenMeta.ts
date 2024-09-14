import { useSDK } from "@thirdweb-dev/react";
import React from "react";
import useSWR from "swr";

export interface TokenData {
  mint: string;  // Ethereum contract address
  name: string;
  symbol: string;
  image?: string;
  decimals: number;
  usdPrice: number;
}

const KNOWN_TOKEN_DATA: Record<string, Partial<TokenData>> = {
  '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': {  // USDC on Optimism
    name: 'USDC',
    symbol: 'USDC',
    image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    decimals: 6,
    usdPrice: 1,
  },
  // Add other known tokens here
};

const fetchTokenMeta = async (sdk: any, tokenAddress: string) => {
  // Fetch token metadata using Thirdweb SDK or fallback to known token data
  const tokenMetadata = await sdk.getToken(tokenAddress).metadata.get();
  return {
    mint: tokenAddress,
    name: tokenMetadata?.name || "Unknown",
    symbol: tokenMetadata?.symbol || tokenAddress.substring(0, 3),
    image: tokenMetadata?.image || KNOWN_TOKEN_DATA[tokenAddress]?.image,
    decimals: tokenMetadata?.decimals || 18,
    usdPrice: tokenMetadata?.price || 0,
  };
};

/**
 * Fetches token metadata for a given token address
 */
export function useTokenMeta(mint: string) {
  const sdk = useSDK();

  // Use SWR for caching and re-fetching token metadata
  const { data } = useSWR(mint ? ['token-meta', mint] : null, () => fetchTokenMeta(sdk, mint));

  return data || {
    mint,
    name: "Unknown",
    symbol: mint.substring(0, 3),
    image: KNOWN_TOKEN_DATA[mint]?.image,
    decimals: 18,
    usdPrice: 0,
    ...KNOWN_TOKEN_DATA[mint]
  };
}
