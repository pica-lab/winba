import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useSmartWallet } from '@thirdweb-dev/react';
import { WinbaPlatformContext } from '../WinbaPlatformProvider'; // Updated from GambaPlatformProvider
import { UiPoolState, GameResult, WinbaPlayInput, throwTransactionError } from 'winba-core-v2'; // Updated imports
import { getPoolAddress, SYSTEM_PROGRAM } from 'winba-core-v2'; // Updated imports

let betBuffer: WinbaPlayInput; // Changed from GambaPlayInput

export const useGame = (contractAddress: string, abi: any) => {
  const { smartWallet } = useSmartWallet(); // Get the connected smart wallet
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const context = useContext(WinbaPlatformContext); // Updated from GambaPlatformContext

  const playGame = async (input: WinbaPlayInput) => {
    if (!smartWallet) {
      throw new Error('Smart wallet not connected');
    }

    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(smartWallet.address);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Deduct wager from the player's balance
      if (context.selectedPool.token.equals(FAKE_TOKEN_MINT)) {
        if (context.fakeBalance < input.wager) {
          throw throwTransactionError(new Error('Insufficient funds'));
        }
        context.setFakeBalance(context.fakeBalance - input.wager);
      }

      betBuffer = input;

      const tx = await contract.playGame(
        input.wager,
        input.bet,
        input.clientSeed,
        input.poolAddress,
        input.tokenAddress,
        input.creator,
        input.creatorFee,
        input.jackpotFee,
        input.metadata,
        input.useBonus
      );

      await tx.wait(); // Wait for the transaction to be mined
    } catch (err) {
      console.error('Error playing game:', err);
      setError('Failed to play the game');
    } finally {
      setIsLoading(false);
    }
  };

  const getResult = async (): Promise<GameResult> => {
    if (!betBuffer) throw new Error('No game in progress');

    const resultIndex = Math.random() * betBuffer.bet.length | 0;
    const multiplier = betBuffer.bet[resultIndex];
    const wager = betBuffer.wager;
    const payout = multiplier * wager;
    const profit = payout - wager;

    // Update the fake balance after calculating the result
    context.setFakeBalance(context.fakeBalance + payout);

    return {
      creator: context.platform.creator,
      user: smartWallet.address,
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

  return {
    isLoading,   // Loading state during game execution
    error,       // Error state
    playGame,    // Function to play the game
    getResult,   // Function to get the game result
  };
};
