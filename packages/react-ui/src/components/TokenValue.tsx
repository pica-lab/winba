import React from "react";
import { ethers } from "ethers";

interface TokenValueProps {
  value: ethers.BigNumber;  // Token value as a BigNumber
  decimals?: number;        // Token decimals (default is 18 for most ERC-20 tokens)
  symbol?: string;          // Token symbol (optional)
}

// Component to display a formatted token value
const TokenValue: React.FC<TokenValueProps> = ({ value, decimals = 18, symbol = "" }) => {
  // Format the BigNumber value to a readable string with proper decimals
  const formattedValue = ethers.utils.formatUnits(value, decimals);

  return (
    <span>
      {formattedValue} {symbol}
    </span>
  );
};

export default TokenValue;
