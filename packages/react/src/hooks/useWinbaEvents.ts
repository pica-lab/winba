import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSmartWallet } from "@thirdweb-dev/react";

// Define the event structure
interface WinbaEvent {
  event: string;
  blockNumber: number;
  transactionHash: string;
  data: any;
}

// Hook to fetch and manage Winba events
export const useWinbaEvents = (contractAddress: string, abi: any, eventName: string) => {
  const { smartWallet } = useSmartWallet(); // Get the connected smart wallet
  const [events, setEvents] = useState<WinbaEvent[]>([]); // State to store the fetched events
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contractAddress || !smartWallet) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const contract = new ethers.Contract(contractAddress, abi, provider);

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch past events for the specified event name
        const filter = contract.filters[eventName](); // Create a filter for the event
        const logs = await provider.getLogs({
          ...filter,
          fromBlock: 0, // Fetch events from the genesis block, adjust as needed
          toBlock: "latest", // Up to the latest block
        });

        // Parse logs into readable event data
        const parsedEvents = logs.map((log) => {
          const parsedLog = contract.interface.parseLog(log);
          return {
            event: parsedLog.name,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            data: parsedLog.args,
          };
        });

        setEvents(parsedEvents); // Store the parsed events
      } catch (err) {
        setError("Failed to fetch events");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [contractAddress, smartWallet, eventName, abi]);

  return {
    events,    // Array of fetched events
    isLoading, // Boolean indicating loading state
    error,     // Error message if any
  };
};
