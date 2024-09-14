import { ethers, Contract } from 'ethers';
import { AbiItem } from 'web3-utils';
import { REFERRAL_ABI } from './abi'; // Assuming you have an ABI file for the referral contract

// Get the contract address from environment variables
const PROGRAM_ID = process.env.REACT_APP_REFERRAL_CONTRACT_ADDRESS || ''; // Fallback to empty string if not defined

if (!PROGRAM_ID) {
  throw new Error("Referral contract address is not defined in the environment variables");
}

// Get referrer address for the user using ethers.js
export const getReferrerPda = (creator: string, userAddress: string) => {
  // Assuming you want a unique address for referrals based on the creator and user
  return ethers.utils.solidityKeccak256(["address", "address"], [creator, userAddress]);
};

// Create a referral using the contract
export const createReferral = async (
  provider: ethers.providers.Provider,
  creator: string,
  referAccount: string,
) => {
  const signer = provider.getSigner();
  
  const referralContract = new Contract(PROGRAM_ID, REFERRAL_ABI, signer);

  // Call the method to configure referral account
  const tx = await referralContract.configReferAccount(referAccount, { from: creator });
  return tx.wait(); // Wait for transaction confirmation
};

// Close a referral using the contract
export const closeReferral = async (
  provider: ethers.providers.Provider,
  creator: string,
) => {
  const signer = provider.getSigner();
  
  const referralContract = new Contract(PROGRAM_ID, REFERRAL_ABI, signer);

  // Call the method to close referral account
  const tx = await referralContract.closeReferAccount({ from: creator });
  return tx.wait(); // Wait for transaction confirmation
};

// Fetch referral details from the contract
export const fetchReferral = async (
  provider: ethers.providers.Provider,
  pda: string, // Pass the address of the referral account
) => {
  const signer = provider.getSigner();

  const referralContract = new Contract(PROGRAM_ID, REFERRAL_ABI, signer);

  // Fetch the referral account
  try {
    const account = await referralContract.referralAccounts(pda);
    return account.referrer; // Assuming the contract stores referrer information
  } catch (error) {
    console.error('Error fetching referral:', error);
    return null;
  }
};
