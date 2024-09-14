import React, { useState } from "react";
import { ethers } from "ethers";

interface TokenInputProps {
  decimals?: number;         // Token decimals (default is 18 for most ERC-20 tokens)
  symbol?: string;           // Token symbol (optional, e.g., ETH, USDC)
  onChange: (value: ethers.BigNumber) => void;  // Callback to send the BigNumber value
}

// Component for inputting a token value and converting it to BigNumber
const TokenInput: React.FC<TokenInputProps> = ({ decimals = 18, symbol = "", onChange }) => {
  const [inputValue, setInputValue] = useState<string>(""); // Local state to track the input value

  // Handle input change and convert the value to BigNumber
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Convert the value to BigNumber and call the onChange callback
    if (value) {
      try {
        const bigNumberValue = ethers.utils.parseUnits(value, decimals);
        onChange(bigNumberValue);
      } catch (error) {
        console.error("Invalid value for BigNumber conversion", error);
      }
    } else {
      onChange(ethers.BigNumber.from(0)); // If input is empty, return zero BigNumber
    }
  };

  return (
    <div>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={`Enter amount in ${symbol}`}
        min="0"
        step="any"
        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
      />
      {symbol && <span>{symbol}</span>}
    </div>
  );
};

export default TokenInput;
