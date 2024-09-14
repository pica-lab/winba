import { ethers } from 'ethers';

export const decodeAccount = (data: string | null) => {
  if (!data) return null;
  try {
    return ethers.utils.defaultAbiCoder.decode(['address', 'uint256'], data);
  } catch (error) {
    return null;
  }
};

export const decodeAta = (data: string | null) => {
  if (!data) return null;
  try {
    return ethers.utils.defaultAbiCoder.decode(['address', 'uint256'], data);
  } catch (error) {
    return null;
  }
};

export const makeDecoder = (accountName: string) => {
  return (data: string | null) => {
    return decodeAccount(data);
  };
};

export const decodePlayer = makeDecoder('player');
export const decodeGame = makeDecoder('game');
export const decodePool = makeDecoder('pool');
export const decodeGambaState = makeDecoder('gambaState');
