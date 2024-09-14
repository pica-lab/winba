import { useEffect, useState } from "react";
import { useSmartWallet, useAddress, useChainId } from "@thirdweb-dev/react";
import { ethers } from "ethers";

// Hook to fetch and manage wallet balances
export const useBalances = () => {
  const address = useAddress(); // Get the connected wallet address
  const { smartWallet } = useSmartWallet(); // Access the smart wallet instance
  const chainId = useChainId(); // Get the current chain ID

  const [balances, setBalances] = useState<{ [token: string]: ethers.BigNumber }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !smartWallet) return;

    const fetchBalances = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Assuming you are using the default provider for fetching balances
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // You can add multiple token addresses here if you need to fetch balances for multiple tokens
        const tokenAddresses = ["0xYourTokenAddress1", "0xYourTokenAddress2"]; // Replace with actual token addresses

        const balancePromises = tokenAddresses.map(async (tokenAddress) => {
          const tokenContract = new ethers.Contract(
            tokenAddress,
            [
              // Minimal ERC-20 ABI to fetch balanceOf
              "function balanceOf(address owner) view returns (uint256)"
            ],
            provider
          );

          const balance = await tokenContract.balanceOf(address);
          return { tokenAddress, balance };
        });

        const balancesData = await Promise.all(balancePromises);
        const balanceMap: { [token: string]: ethers.BigNumber } = {};

        balancesData.forEach(({ tokenAddress, balance }) => {
          balanceMap[tokenAddress] = balance;
        });

        setBalances(balanceMap);
      } catch (err) {
        setError("Failed to fetch balances");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [address, smartWallet, chainId]);

  return {
    balances,   // Object with token addresses as keys and balances as values
    isLoading,  // Boolean to show loading state
    error,      // Error message if any error occurs
  };
};
