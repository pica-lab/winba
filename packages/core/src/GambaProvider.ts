import { ethers } from 'ethers';  
import { useContract } from '@thirdweb-dev/react';  

export class GambaProvider {
  contract: ethers.Contract;
  wallet: ethers.Wallet;

  constructor(
    provider: ethers.providers.JsonRpcProvider,  
    walletOrKeypair: ethers.Wallet,
    contractAddress: string,  
    abi: any  
  ) {
    this.wallet = walletOrKeypair;
    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }

  static fromProvider(
    provider: ethers.providers.JsonRpcProvider,
    wallet: ethers.Wallet,
    contractAddress: string,
    abi: any
  ) {
    return new GambaProvider(provider, wallet, contractAddress, abi);
  }

  async createPool(tokenAddress: string, authority: string) {
    const tx = await this.contract.createPool(tokenAddress, authority, {
      from: this.wallet.address,
    });
    await tx.wait(); 
  }

  async depositToPool(poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) {
    const tx = await this.contract.deposit(poolAddress, tokenAddress, amount, {
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async withdrawFromPool(poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) {
    const tx = await this.contract.withdraw(poolAddress, tokenAddress, amount, {
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async mintBonusTokens(poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) {
    const tx = await this.contract.mintBonus(poolAddress, tokenAddress, amount, {
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async createPlayer() {
    const tx = await this.contract.createPlayer({
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async closePlayer() {
    const tx = await this.contract.closePlayer({
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async playGame(
    wager: ethers.BigNumber,
    bet: number[],
    clientSeed: string,
    poolAddress: string,
    tokenAddress: string,
    creator: string,
    creatorFee: number,
    jackpotFee: number,
    metadata: string,
    useBonus: boolean
  ) {
    const tx = await this.contract.playGame(
      wager,
      bet,
      clientSeed,
      creatorFee,
      jackpotFee,
      metadata,
      useBonus,
      {
        from: this.wallet.address,
      }
    );
    await tx.wait();
  }
}
