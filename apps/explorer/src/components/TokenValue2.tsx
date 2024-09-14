import { useTokenMeta } from '@/hooks';
import { ethers } from 'ethers';
import React from 'react';

export interface TokenValueProps {
  mint: string;
  amount: number | bigint;
  suffix?: string;
  exact?: boolean;
  dollar?: boolean;
}

const bigIntToFloat = (big: bigint | number, decimals: number) => {
  const bd = ethers.utils.formatUnits(big, decimals);
  return parseFloat(bd);
};

export function TokenValue2(props: TokenValueProps) {
  const token = useTokenMeta(props.mint);
  const suffix = props.suffix ?? token.symbol;

  const tokenAmount = bigIntToFloat(props.amount, token.decimals);
  const displayFiat = props.dollar;
  const amount = displayFiat ? token.usdPrice * tokenAmount : tokenAmount;

  const displayedAmount = (() => {
    if (!props.exact) {
      if (amount >= 1e9) return (amount / 1e9).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'B';
      if (amount >= 1e6) return (amount / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'M';
      if (amount > 1000) return (amount / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'K';
    }
    return amount.toLocaleString(undefined, { maximumFractionDigits: Math.floor(amount) > 100 ? 1 : 5 });
  })();

  return (
    <>
      {displayFiat ? (
        <>${displayedAmount}</>
      ) : (
        <>
          {displayedAmount} {suffix}
        </>
      )}
    </>
  );
}
