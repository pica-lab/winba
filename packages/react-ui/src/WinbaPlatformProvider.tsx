import React from 'react';
import { useAddress } from '@thirdweb-dev/react'; // For accessing the wallet's address in an EVM environment
import { ethers } from 'ethers';
import { PortalProvider } from './PortalContext';
import { ReferralProvider, ReferralProviderProps } from './referral/ReferralContext';

interface PlatformMeta {
  name: string;
  creator: string; // Changed to string for Ethereum address
}

export interface PoolToken {
  token: string; // Changed to string for Ethereum address
  authority?: string; // Changed to string for Ethereum address
}

export interface WinbaPlatformContext {
  platform: PlatformMeta;
  selectedPool: PoolToken;
  defaultCreatorFee: number;
  defaultJackpotFee: number;
  setDefaultJackpotFee: (defaultJackpotFee: number) => void;
  setPool: (tokenMint: string, authority?: string) => void;
  setToken: (tokenMint: string) => void;
  clientSeed: string;
  setClientSeed: (clientSeed: string) => void;
}

// Create the context
export const WinbaPlatformContext = React.createContext<WinbaPlatformContext>(null!);

interface WinbaPlatformProviderProps extends React.PropsWithChildren {
  creator: string;
  defaultPool?: PoolToken;
  /** How much the player should pay in fees to the platform */
  defaultCreatorFee?: number;
  /** How much the player should pay in fees to play for the jackpot in every game. 0.001 = 0.1% */
  defaultJackpotFee?: number;
  referral?: ReferralProviderProps;
}

export function WinbaPlatformProvider(props: WinbaPlatformProviderProps) {
  const {
    creator,
    children,
    referral = { prefix: 'code', fee: 0.01, autoAccept: true },
  } = props;
  const [selectedPool, setSelectedPool] = React.useState<PoolToken>(props.defaultPool ?? { token: ethers.constants.AddressZero });
  const [clientSeed, setClientSeed] = React.useState(String(Math.random() * 1e9 | 0));
  const [defaultJackpotFee, setDefaultJackpotFee] = React.useState(props.defaultJackpotFee ?? 0.001);
  const defaultCreatorFee = props.defaultCreatorFee ?? 0.01;

  const setPool = (
    tokenMint: string,
    authority: string = ethers.constants.AddressZero,
  ) => {
    setSelectedPool({
      token: tokenMint,
      authority: authority,
    });
  };

  const setToken = (tokenMint: string) => {
    setPool(tokenMint);
  };

  return (
    <WinbaPlatformContext.Provider
      value={{
        platform: {
          name: '',
          creator,
        },
        selectedPool,
        setToken,
        setPool,
        clientSeed,
        setClientSeed,
        defaultJackpotFee,
        setDefaultJackpotFee,
        defaultCreatorFee,
      }}
    >
      <ReferralProvider {...referral}>
        <PortalProvider>
          {children}
        </PortalProvider>
      </ReferralProvider>
    </WinbaPlatformContext.Provider>
  );
}
