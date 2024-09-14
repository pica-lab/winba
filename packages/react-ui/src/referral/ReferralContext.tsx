import { useAddress, useContract, useSigner, ThirdwebProvider } from "@thirdweb-dev/react";
import { ethers, Contract } from "ethers";
import React, { createContext, PropsWithChildren, useEffect, useState } from "react";
import { fetchReferral, getReferrerPda } from "./program";
import { makeReferralPlugin } from "./referralPlugin";
import { getReferralAddressFromUrl } from "./referralUtils";

const defaultPrefix = "code";

export interface ReferralContext {
  referrerAddress: string | null;
  isOnChain: boolean;
  prefix: string;
  referralStatus: "local" | "on-chain" | "fetching";
  clearCache: () => void;
  setCache: (address: string, isOnChain?: boolean) => void;
}

export const ReferralContext = createContext<ReferralContext>({
  referrerAddress: null,
  isOnChain: false,
  prefix: defaultPrefix,
  referralStatus: "local",
  clearCache: () => null,
  setCache: () => null,
});

export interface ReferralProviderProps {
  fee: number;
  prefix?: string;
  autoAccept?: boolean;
  /** localStorage or sessionStorage */
  storage?: Storage;
}

export function ReferralProvider({
  fee,
  prefix = defaultPrefix,
  children,
  storage = localStorage,
  autoAccept = true,
}: PropsWithChildren<ReferralProviderProps>) {
  const address = useAddress(); // Using Thirdweb for connected wallet address
  const signer = useSigner(); // Using Thirdweb to get the connected wallet's signer
  const [isFetchingOnChain, setIsFetchingOnChain] = useState(false);
  const [referralCache, setReferralCache] = useState<{
    address: string | null;
    isOnChain: boolean;
  }>({ address: null, isOnChain: false });

  const getOnChainAddress = async () => {
    try {
      if (!signer || !address) throw new Error("Wallet not connected");
      
      // Assume that getReferrerPda returns an EVM-compatible contract address
      const referrerContractAddress = getReferrerPda(address); 
      
      const referralContract = new Contract(
        referrerContractAddress,
        [ 
          // Contract ABI, define methods you want to use like `fetchReferral`
          "function fetchReferral(address owner) public view returns (address)"
        ],
        signer
      );

      // Call the fetchReferral function from the contract
      const referrerAddress = await referralContract.fetchReferral(address);
      return referrerAddress;
    } catch {
      return null;
    }
  };

  const getAddressFromStorage = (key: string): string | null => {
    try {
      const value = storage.getItem(key);
      return value ? value : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const handleReferral = async () => {
      // Check if we have an active invite URL (?ref=<address>)
      const urlAddress = getReferralAddressFromUrl(prefix);
      if (autoAccept && urlAddress) {
        // Store the referral address in "referral-new", since user might not have connected in this step
        storage.setItem("referral-new", urlAddress);

        // Refresh URL
        const url = new URL(window.location.href);
        const params = url.searchParams;
        params.delete(prefix);
        const newUrl = url.origin + url.pathname + (params.toString() ? "?" + params.toString() : "");
        window.history.replaceState({}, document.title, newUrl);
        return;
      }

      if (!address) {
        setReferralCache({ address: null, isOnChain: false });
        return;
      }

      // Fetch on-chain address to determine if the transaction plugin needs to upsert a new one
      setIsFetchingOnChain(true);
      try {
        const onChainAddress = await getOnChainAddress();
        if (isCancelled) return;
        if (!onChainAddress) throw new Error();
        // Use on-chain address
        setReferralCache({ address: onChainAddress, isOnChain: true });
      } catch {
        if (isCancelled) return;
        const storedReferralForAddress = getAddressFromStorage("referral-" + address);
        if (storedReferralForAddress) {
          // Use local address
          setReferralCache({ address: storedReferralForAddress, isOnChain: false });
          return;
        }
        const newReferral = getAddressFromStorage("referral-new");
        if (newReferral && newReferral !== address) {
          // Update and use local address
          setReferralCache({ address: newReferral, isOnChain: false });
          storage.setItem("referral-" + address, newReferral);
          storage.removeItem("referral-new");
        }
      } finally {
        if (!isCancelled) setIsFetchingOnChain(false);
      }
    };

    handleReferral();

    return () => {
      isCancelled = true;
    };
  }, [autoAccept, address, prefix]);

  useEffect(() => {
    if (!referralCache.address) return;
    return makeReferralPlugin(
      referralCache.address,
      !referralCache.isOnChain,
      fee,
      1
    );
  }, [fee, referralCache.address, referralCache.isOnChain]);

  const clearCache = () => {
    if (address) {
      storage.removeItem("referral-" + address);
    }
    storage.removeItem("referral-new");
    setReferralCache({ address: null, isOnChain: false });
  };

  const setCache = (newAddress: string, isOnChain = false) => {
    if (address) {
      storage.setItem("referral-" + address, newAddress);
    }
    storage.setItem("referral-new", newAddress);
    setReferralCache({ address: newAddress, isOnChain });
  };

  return (
    <ReferralContext.Provider
      value={{
        prefix,
        isOnChain: referralCache.isOnChain,
        referrerAddress: referralCache.address,
        referralStatus: isFetchingOnChain
          ? "fetching"
          : referralCache.isOnChain
          ? "on-chain"
          : "local",
        clearCache,
        setCache,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
}
