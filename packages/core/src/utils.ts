```typescript
import { ethers } from 'ethers';

// Utility function to convert basis points to a percentage
export const basisPoints = (bps: number): ethers.BigNumber => {
  return ethers.BigNumber.from(bps).mul(ethers.BigNumber.from(10_000)).div(100);
};

// Utility function to calculate the percentage of a given amount based on basis points
export const calculatePercentage = (amount: ethers.BigNumber, bps: number): ethers.BigNumber => {
  return amount.mul(bps).div(10_000);
};

// Utility function to generate a unique client seed
export const generateClientSeed = (): string => {
  return ethers.utils.hexlify(ethers.utils.randomBytes(16));
};

// Utility function to validate Ethereum addresses
export const isValidAddress = (address: string): boolean => {
  return ethers.utils.isAddress(address);
};

// Utility function to format an address (e.g., shorten for display purposes)
export const formatAddress = (address: string, startLength = 6, endLength = 4): string => {
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
};

// Utility function to convert a number to BigNumber
export const toBigNumber = (value: number | string): ethers.BigNumber => {
  return ethers.BigNumber.from(value);
};

// Utility function to sleep for a specified number of milliseconds (used for delays)
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Utility function to parse a BigNumber to a formatted string
export const formatBigNumber = (value: ethers.BigNumber, decimals = 18): string => {
  return ethers.utils.formatUnits(value, decimals);
};

// Utility function to parse a formatted string back to BigNumber
export const parseUnits = (value: string, decimals = 18): ethers.BigNumber => {
  return ethers.utils.parseUnits(value, decimals);
};

// Utility function to check if a BigNumber is zero
export const isZero = (value: ethers.BigNumber): boolean => {
  return value.isZero();
};
```
