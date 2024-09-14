import React from "react";
import { ethers } from "ethers";
import useSWR from "swr";

interface NameRecord {
  name: string;
  domain: string;
}

/**
 * Fetches the ENS (Ethereum Name Service) name associated with an Ethereum address using the ethers.js library.
 */
const fetchENSName = async (provider: ethers.providers.Provider, address: string): Promise<NameRecord | undefined> => {
  try {
    const ensName = await provider.lookupAddress(address);
    if (!ensName) return undefined;

    return {
      name: ensName,
      domain: "ens",  // You could add more logic if you're handling multiple domain systems
    };
  } catch (error) {
    console.error("Failed to fetch ENS name:", error);
    return undefined;
  }
};

/**
 * React hook to retrieve ENS name for an Ethereum address.
 */
export function useENSName(address: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum); // Assume MetaMask provider or similar
  const { data } = useSWR(address ? `ens-name-${address}` : null, () => fetchENSName(provider, address));

  return data?.name ?? undefined;
}

/**
 * Example component usage for showing ENS name or default to address.
 */
export function AddressDisplay({ address }: { address: string }) {
  const ensName = useENSName(address);
  return <span>{ensName ? ensName : `${address.slice(0, 6)}...${address.slice(-4)}`}</span>;
}
