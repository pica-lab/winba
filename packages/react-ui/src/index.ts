import React from 'react';
import { WinbaPlatformContext } from './WinbaPlatformProvider'; // Updated from Gamba to Winba
import { TokenMetaContext } from './TokenMetaProvider';
import { useTokenMeta } from './hooks';
import { ethers } from 'ethers'; // For Ethereum address and token management

export * from './EffectTest';
export * from './ErrorBoundary';
export * from './WinbaPlatformProvider'; // Updated export
export * from './GameContext';
export * from './TokenMetaProvider';
export * from './components/Canvas';
export * from './components/TokenValue';
export * from './hooks';
export * from './makeEvmTokenFetcher'; // Renamed from Helius to EVM
export * from './referral/ReferralContext';
export * from './referral/useReferral';

export interface GameBundle<T = any> {
  id: string;
  app: any;
  meta?: T;
  props?: any;
}

export function useWagerInput(initial?: number) {
  const [_wager, setWager] = React.useState(initial);
  const context = React.useContext(WinbaPlatformContext); // Updated to WinbaPlatformContext
  const token = useTokenMeta(context.selectedPool.token);
  return [_wager ?? token.baseWager, setWager] as const;
}

/** @deprecated Use <TokenMetaProvider /> */
export function useTokenList() {
  return React.useContext(TokenMetaContext).tokens ?? [];
}

/** @deprecated Use <TokenMetaProvider /> */
export const WinbaStandardTokens = { // Updated from Gamba to Winba
  fake: {
    mint: '0xFakeTokenAddress', // Example Ethereum address for a fake token
    name: 'Fake Money',
    symbol: 'FAKE',
    decimals: 18,
    baseWager: ethers.utils.parseUnits('1', 18), // Using ethers to handle decimals
  },
  eth: {
    mint: ethers.constants.AddressZero, // AddressZero for ETH
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    baseWager: ethers.utils.parseUnits('0.01', 18),
  },
  usdc: {
    mint: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Ethereum USDC address
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    baseWager: ethers.utils.parseUnits('0.5', 6),
  },
  guac: {
    mint: '0xGuacamoleTokenAddress', // Replace with actual token address
    name: 'Guacamole',
    symbol: 'GUAC',
    decimals: 5,
    baseWager: ethers.utils.parseUnits('1', 5),
  },
};
