import { ethers } from 'ethers';

// This function generates a deterministic address using the pool seed and the token address.
export const getPoolAddress = (tokenAddress: string, authority: string): string => {
  const poolSeed = ethers.utils.solidityKeccak256(
    ['string', 'address', 'address'],
    ['POOL', tokenAddress, authority]
  );
  return ethers.utils.getAddress(poolSeed);
};

// This function generates the bonus mint address for the pool using the pool's address.
export const getPoolBonusAddress = (poolAddress: string): string => {
  const bonusSeed = ethers.utils.solidityKeccak256(
    ['string', 'address'],
    ['POOL_BONUS_MINT', poolAddress]
  );
  return ethers.utils.getAddress(bonusSeed);
};

// This function generates the LP mint address for the pool using the pool's address.
export const getPoolLpAddress = (poolAddress: string): string => {
  const lpMintSeed = ethers.utils.solidityKeccak256(
    ['string', 'address'],
    ['POOL_LP_MINT', poolAddress]
  );
  return ethers.utils.getAddress(lpMintSeed);
};

// This function generates the pool's underlying token account address using the pool's address.
export const getPoolUnderlyingTokenAccountAddress = (poolAddress: string): string => {
  const underlyingTokenAccountSeed = ethers.utils.solidityKeccak256(
    ['string', 'address'],
    ['POOL_ATA', poolAddress]
  );
  return ethers.utils.getAddress(underlyingTokenAccountSeed);
};

// This function generates the pool's jackpot token account address using the pool's address.
export const getPoolJackpotTokenAccount = (poolAddress: string): string => {
  const jackpotTokenAccountSeed = ethers.utils.solidityKeccak256(
    ['string', 'address'],
    ['POOL_JACKPOT', poolAddress]
  );
  return ethers.utils.getAddress(jackpotTokenAccountSeed);
};

// This function generates the winba state address.
export const getWinbaStateAddress = (): string => {
  const winbaStateSeed = ethers.utils.solidityKeccak256(
    ['string'],
    ['WINBA_STATE']
  );
  return ethers.utils.getAddress(winbaStateSeed);
};

// This function generates the player address for a specific user.
export const getPlayerAddress = (userAddress: string): string => {
  const playerSeed = ethers.utils.solidityKeccak256(
    ['string', 'address'],
    ['PLAYER', userAddress]
  );
  return ethers.utils.getAddress(playerSeed);
};

// This function generates the game address for a specific user.
export const getGameAddress = (userAddress: string): string => {
  const gameSeed = ethers.utils.solidityKeccak256(
    ['string', 'address'],
    ['GAME', userAddress]
  );
  return ethers.utils.getAddress(gameSeed);
};
```
