import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSmartWallet } from "@thirdweb-dev/react";

interface PoolInfo {
  poolAddress: string;
  liquidity: ethers.BigNumber;
  totalPlayers: ethers.BigNumber;
  totalGames: ethers.BigNumber;
}

export const useCurrentPool = (abi: any, poolAddress: string) => {
  const { smartWallet } = useSmartWallet(); // Get the connected smart wallet
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null); // Store the pool information
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Load contract address from .env file
  const contractAddress = process.env.REACT_APP_POOL_CONTRACT_ADDRESS;

  useEffect(() => {
    if (!contractAddress || !poolAddress || !smartWallet) return;

    const fetchPoolInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        // Fetch the pool information
        const liquidity = await contract.getLiquidity(poolAddress);
        const totalPlayers = await contract.getTotalPlayers(poolAddress);
        const totalGames = await contract.getTotalGames(poolAddress);

        // Set the pool information
        setPoolInfo({
          poolAddress,
          liquidity,
          totalPlayers,
          totalGames,
        });
      } catch (err) {
        console.error("Error fetching pool information:", err);
        setError("Failed to fetch pool information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolInfo();
  }, [contractAddress, poolAddress, smartWallet]);

  return {
    poolInfo,    // Pool information (liquidity, total players, total games)
    isLoading,   // Loading state
    error,       // Error message
  };
};
