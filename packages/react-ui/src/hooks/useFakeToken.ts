import {
  WinbaPlayInput,
  GameResult,
  UiPoolState,
  throwTransactionError,
  useWalletAddress,
} from 'winba-react-v2';
import React from 'react';
import { StoreApi, create } from 'zustand';
import { WinbaPlatformContext } from '../WinbaPlatformProvider';
import { getPoolAddress, SYSTEM_PROGRAM } from 'winba-core-v2';
import { FAKE_TOKEN_MINT } from '../TokenMetaProvider';

let betBuffer: WinbaPlayInput;

interface FakeAccountStore {
  balance: number;
  set: StoreApi<FakeAccountStore>['setState'];
}

// Zustand store for managing fake account balance
export const useFakeAccountStore = create<FakeAccountStore>((set) => ({
  balance: 1000e9, // Initial balance is set to 1000 tokens (considering 9 decimals)
  set,
}));

useNextFakeResult.delay = 500; // Simulating a delay for game result processing

// Hook to simulate a game result
export function useNextFakeResult() {
  const store = useFakeAccountStore();
  const context = React.useContext(WinbaPlatformContext);
  const user = useWalletAddress();

  return async function getNextFakeResult(): Promise<GameResult> {
    if (!betBuffer) throw new Error('No game in progress');

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, useNextFakeResult.delay));

    const resultIndex = Math.random() * betBuffer.bet.length | 0; // Randomly select a bet
    const multiplier = betBuffer.bet[resultIndex]; // Get the multiplier from the selected bet
    const wager = betBuffer.wager; // Wager amount
    const payout = multiplier * wager; // Calculate payout based on multiplier
    const profit = payout - wager; // Profit is payout minus wager

    // Update the fake account balance after the game
    store.set((state) => ({ balance: state.balance + payout }));

    return {
      creator: context.platform.creator,
      user,
      rngSeed: 'fake_rng_seed',
      clientSeed: betBuffer.clientSeed ?? '',
      nonce: 0,
      bet: betBuffer.bet,
      resultIndex,
      wager,
      payout,
      profit,
      multiplier,
      token: context.selectedPool.token,
      bonusUsed: 0,
      jackpotWin: 0,
    };
  };
}

// Hook to simulate a token interaction within the platform (fake token gameplay)
export function useFakeToken() {
  const context = React.useContext(WinbaPlatformContext);
  const balance = useFakeAccountStore();
  const result = useNextFakeResult();

  // Check if the selected pool's token matches the FAKE_TOKEN_MINT
  const isActive = context.selectedPool.token.equals(FAKE_TOKEN_MINT);

  // Function to initiate a play action
  const play = (input: WinbaPlayInput) => {
    if (balance.balance < input.wager) {
      throw throwTransactionError(new Error('Insufficient funds'));
    }

    // Deduct the wager from the balance
    balance.set(({ balance }) => ({ balance: balance - input.wager }));
    betBuffer = input; // Store the current bet input
    return 'fake_game'; // Simulate a game identifier
  };

  // Simulated pool state for the fake token
  const pool: UiPoolState = {
    publicKey: getPoolAddress(context.selectedPool.token),
    authority: SYSTEM_PROGRAM,
    token: context.selectedPool.token,
    minWager: 0,
    winbaFee: 0, // Changed from gambaFee to winbaFee
    poolFee: 0,
    jackpotBalance: 0,
    liquidity: BigInt(1e99), // Simulated high liquidity
    maxPayout: 1e99, // Simulated unlimited max payout
  };

  return { isActive, balance, result, play, pool };
}
