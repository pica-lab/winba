import { useState } from "react";
import { ethers } from "ethers";
import { useSmartWallet } from "@thirdweb-dev/react";

// Hook to send a transaction using the connected smart wallet
export const useSendTransaction = () => {
  const { smartWallet } = useSmartWallet(); // Get the connected smart wallet
  const [isSending, setIsSending] = useState<boolean>(false); // Loading state for sending transaction
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to send a transaction
  const sendTransaction = async (to: string, value: ethers.BigNumber) => {
    if (!smartWallet) {
      setError("Smart wallet not connected");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(smartWallet.address);

      // Create transaction
      const tx = await signer.sendTransaction({
        to,
        value,
      });

      // Wait for transaction to be mined
      await tx.wait();
    } catch (err) {
      console.error("Error sending transaction:", err);
      setError("Failed to send transaction");
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,    // Boolean indicating if the transaction is in progress
    sendTransaction, // Function to trigger a transaction
    error,        // Error message if any error occurs
  };
};
