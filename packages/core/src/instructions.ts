import { ethers } from 'ethers';

export class WinbaInstructions {
  contract: ethers.Contract;
  wallet: ethers.Wallet;

  constructor(
    contractAddress: string,
    abi: any,
    provider: ethers.providers.JsonRpcProvider,
    wallet: ethers.Wallet
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, provider);
    this.wallet = wallet;
  }

  async initializeWinba() {
    const tx = await this.contract.winbaInitialize({
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async setAuthority(newAuthority: string) {
    const tx = await this.contract.winbaSetAuthority(newAuthority, {
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async setConfig(
    rngAddress: string,
    winbaFee: ethers.BigNumber,
    maxCreatorFee: ethers.BigNumber,
    poolCreationFee: ethers.BigNumber,
    antiSpamFee: ethers.BigNumber,
    maxHouseEdge: ethers.BigNumber,
    defaultPoolFee: ethers.BigNumber,
    jackpotPayoutToUserBps: ethers.BigNumber,
    jackpotPayoutToCreatorBps: ethers.BigNumber,
    jackpotPayoutToPoolBps: ethers.BigNumber,
    jackpotPayoutToWinbaBps: ethers.BigNumber,
    bonusToJackpotRatioBps: ethers.BigNumber,
    maxPayoutBps: ethers.BigNumber,
    poolWithdrawFeeBps: ethers.BigNumber,
    poolCreationAllowed: boolean,
    poolDepositAllowed: boolean,
    poolWithdrawAllowed: boolean,
    playingAllowed: boolean,
    distributionRecipient: string
  ) {
    const tx = await this.contract.winbaSetConfig(
      rngAddress,
      winbaFee,
      maxCreatorFee,
      poolCreationFee,
      antiSpamFee,
      maxHouseEdge,
      defaultPoolFee,
      jackpotPayoutToUserBps,
      jackpotPayoutToCreatorBps,
      jackpotPayoutToPoolBps,
      jackpotPayoutToWinbaBps,
      bonusToJackpotRatioBps,
      maxPayoutBps,
      poolWithdrawFeeBps,
      poolCreationAllowed,
      poolDepositAllowed,
      poolWithdrawAllowed,
      playingAllowed,
      distributionRecipient,
      {
        from: this.wallet.address,
      }
    );
    await tx.wait();
  }

  async initializePool(
    tokenAddress: string,
    authority: string,
    lookupAddress: string
  ) {
    const tx = await this.contract.poolInitialize(tokenAddress, authority, lookupAddress, {
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async depositToPool(poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) {
    const tx = await this.contract.poolDeposit(poolAddress, tokenAddress, amount, {
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async withdrawFromPool(poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) {
    const tx = await this.contract.poolWithdraw(poolAddress, tokenAddress, amount, {
      from: this.wallet.address,
    });
    await tx.wait();
  }

  async mintBonusTokens(poolAddress: string, tokenAddress: string, amount: ethers.BigNumber) {
    const tx = await this.contract.poolMintBonusTokens(poolAddress, tokenAddress, amount, {
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

  async closePlayer() {
    const tx = await this.contract.closePlayer({
      from: this.wallet.address,
    });
    await tx.wait();
  }
}
