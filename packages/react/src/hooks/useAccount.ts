import { useSmartWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

// Hook to manage user account interactions with Telegram Mini App API
export const useAccount = () => {
  const address = useAddress(); // Get the connected wallet address
  const { smartWallet, connect } = useSmartWallet(); // Use smart wallet from Thirdweb
  const disconnectWallet = useDisconnect(); // Function to disconnect the wallet

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [telegramUser, setTelegramUser] = useState<any>(null); // Store Telegram user info

  useEffect(() => {
    // Initialize Telegram Web App API
    const tg = window.Telegram.WebApp;
    tg.ready(); // Set up the Telegram Mini App

    const user = tg.initDataUnsafe?.user;
    if (user) {
      setTelegramUser(user); // Store the Telegram user data
    }

    console.log("Telegram User: ", user);
  }, []);

  useEffect(() => {
    // Check if the user is connected to the smart wallet
    setIsConnected(!!address);
  }, [address]);

  const connectSmartWallet = async () => {
    try {
      await connect({
        chainId: 10, // OP (Optimism) chain ID, adjust as needed
        walletOptions: {
          factoryAddress: "0xYourFactoryAddress", // Replace with your Smart Wallet Factory address
        },
      });
    } catch (error) {
      console.error("Failed to connect smart wallet", error);
    }
  };

  return {
    address,                // The user's wallet address
    isConnected,            // Boolean indicating if the wallet is connected
    connectSmartWallet,     // Function to trigger the smart wallet connection
    disconnectWallet,       // Function to disconnect the wallet
    telegramUser,           // The Telegram user information
  };
};
