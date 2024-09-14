import { ethers } from 'ethers';

// Define a type for the wallet interacting with the Winba contract
export type WinbaProviderWallet = ethers.Wallet | ethers.Signer;

// Define a type for the pool configuration
export interface PoolConfig {
  minWager: ethers.BigNumber; // Minimum wager allowed
  depositLimit: boolean; // Whether a deposit limit is enforced
  depositLimitAmount: ethers.BigNumber; // Maximum deposit allowed if the limit is enforced
  customPoolFee: boolean; // Whether a custom pool fee is applied
  customPoolFeeBps: ethers.BigNumber; // Custom pool fee in basis points
  customMaxPayout: boolean; // Whether a custom maximum payout is applied
  customMaxPayoutBps: ethers.BigNumber; // Custom maximum payout in basis points
  depositWhitelistRequired: boolean; // Whether a deposit whitelist is required
  depositWhitelistAddress: string; // Address of the deposit whitelist
}

// Define a type for the pool state
export interface PoolState {
  poolAddress: string; // Address of the pool
  authority: string; // Authority of the pool
  underlyingTokenMint: string; // Token mint address used by the pool
  lpMintAddress: string; // LP token mint address
  bonusMintAddress: string; // Bonus token mint address
  poolLiquidity: ethers.BigNumber; // Current liquidity of the pool
  depositLimitAmount: ethers.BigNumber; // The limit for deposits in the pool
  plays: ethers.BigNumber; // Number of plays in the pool
  customPoolFeeBps: ethers.BigNumber; // Custom pool fee in basis points
  customMaxPayoutBps: ethers.BigNumber; // Custom maximum payout in basis points
}

// Define a type for game configuration
export interface GameConfig {
  wager: ethers.BigNumber; // Wager amount for the game
  bet: number[]; // Array of bets placed in the game
  clientSeed: string; // Seed provided by the client for randomness
  poolAddress: string; // Address of the pool used for the game
  tokenAddress: string; // Address of the token used in the game
  creator: string; // Address of the game creator
  creatorFee: ethers.BigNumber; // Fee charged by the creator
  jackpotFee: ethers.BigNumber; // Fee allocated to the jackpot
  metadata: string; // Metadata associated with the game
  useBonus: boolean; // Whether bonus tokens are being used in the game
}

// Define a type for player state
export interface PlayerState {
  playerAddress: string; // Address of the player
  gamesPlayed: ethers.BigNumber; // Number of games played by the player
  totalWagered: ethers.BigNumber; // Total amount wagered by the player
  totalWins: ethers.BigNumber; // Total amount won by the player
  bonusTokens: ethers.BigNumber; // Amount of bonus tokens available to the player
}

// Define a type for the Winba state
export interface WinbaState {
  authority: string; // Address of the Winba authority
  rngAddress: string; // Random number generator (RNG) contract address
  winbaFeeBps: ethers.BigNumber; // Fee in basis points charged by Winba
  poolCreationFee: ethers.BigNumber; // Fee for creating a pool
  defaultPoolFeeBps: ethers.BigNumber; // Default fee for pools
  jackpotPayoutToUserBps: ethers.BigNumber; // Jackpot payout percentage to the user
  jackpotPayoutToCreatorBps: ethers.BigNumber; // Jackpot payout percentage to the game creator
  jackpotPayoutToPoolBps: ethers.BigNumber; // Jackpot payout percentage to the pool
  jackpotPayoutToWinbaBps: ethers.BigNumber; // Jackpot payout percentage to Winba
  maxHouseEdgeBps: ethers.BigNumber; // Maximum allowed house edge in basis points
  maxCreatorFeeBps: ethers.BigNumber; // Maximum allowed creator fee in basis points
  maxPayoutBps: ethers.BigNumber; // Maximum payout in basis points
  poolWithdrawFeeBps: ethers.BigNumber; // Pool withdrawal fee in basis points
  poolCreationAllowed: boolean; // Flag indicating whether pool creation is allowed
  poolDepositAllowed: boolean; // Flag indicating whether deposits into pools are allowed
  poolWithdrawAllowed: boolean; // Flag indicating whether withdrawals from pools are allowed
  playingAllowed: boolean; // Flag indicating whether playing games is allowed
  distributionRecipient: string; // Address to receive distribution of fees
}
```
