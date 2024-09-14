import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSmartWallet } from "@thirdweb-dev/react";

// Hook to manage pool interactions on Winba
export const usePool = (contractAddress: string, abi: any) => {
  const { smartWallet } = useSmartWallet(); // Get the connected smart wallet
  const [poolInfo, setPoolInfo] = useState<any>(null); // State to store pool information
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch pool information
  const fetchPoolInfo = async (poolAddress: string) => {
    if (!smartWallet) {
      setError("Smart wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const poolData = await contract.getPoolInfo(poolAddress);

      setPoolInfo(poolData);
    } catch (err) {
      console.error("Error fetching pool information:", err);
      setError("Failed to fetch pool information");
    } finally {
      setIsLoading(false);
    }
  };

  // Deposit to the pool
  const depositToPool = async (poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) => {
    if (!smartWallet) {
      setError("Smart wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(smartWallet.address);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.deposit(poolAddress, tokenAddress, amount, {
        from: smartWallet.address,
      });
      await tx.wait();
    } catch (err) {
      console.error("Error depositing to pool:", err);
      setError("Failed to deposit to pool");
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw from the pool
  const withdrawFromPool = async (poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) => {
    if (!smartWallet) {
      setError("Smart wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(smartWallet.address);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.withdraw(poolAddress, tokenAddress, amount, {
        from: smartWallet.address,
      });
      await tx.wait();
    } catch (err) {
      console.error("Error withdrawing from pool:", err);
      setError("Failed to withdraw from pool");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    poolInfo, // Information about the pool
    fetchPoolInfo, // Function to fetch pool information
    depositToPool, // Function to deposit to the pool
    withdrawFromPool, // Function to withdraw from the pool
    isLoading, // Loading state
    error, // Error message
  };
};
