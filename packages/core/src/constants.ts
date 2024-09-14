import { ethers } from 'ethers';

// Load contract address from environment variables
export const PROGRAM_ID = process.env.CONTRACT_ADDRESS || ''; 
export const SYSTEM_PROGRAM = ethers.constants.AddressZero;
export const BPS_PER_WHOLE = 10000;

export const GAME_SEED = 'GAME';
export const PLAYER_SEED = 'PLAYER';
export const POOL_SEED = 'POOL';
export const GAMBA_STATE_SEED = 'GAMBA_STATE';
export const POOL_ATA_SEED = 'POOL_ATA';
export const POOL_JACKPOT_SEED = 'POOL_JACKPOT';
export const POOL_BONUS_UNDERLYING_TA_SEED = 'POOL_BONUS_UNDERLYING_TA';
export const POOL_BONUS_MINT_SEED = 'POOL_BONUS_MINT';
export const POOL_LP_MINT_SEED = 'POOL_LP_MINT';
