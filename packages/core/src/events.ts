import { ethers } from 'ethers';

export type GambaEvent<EventData> = {
  event: string;
  data: EventData;
  signature: string;
  blockNumber: number;
  timestamp: number;
};

export const parseTransactionEvents = (logs: ethers.providers.Log[]) => {
  try {
    const parsedEvents: GambaEvent<any>[] = logs.map(log => {
      const parsed = ethers.utils.defaultAbiCoder.decode(
        ['string', 'bytes'],
        log.data
      );
      return {
        event: log.topics[0],
        data: parsed,
        signature: log.transactionHash,
        blockNumber: log.blockNumber,
        timestamp: log.blockNumber * 1000, // Approximation, replace with actual timestamp if available
      };
    });
    return parsedEvents;
  } catch (error) {
    return [];
  }
};

export const parseGambaTransaction = async (
  provider: ethers.providers.Provider,
  txHash: string
) => {
  const txReceipt = await provider.getTransactionReceipt(txHash);
  const logs = txReceipt.logs;
  const events = parseTransactionEvents(logs);

  return events.map(event => ({
    signature: txHash,
    blockNumber: txReceipt.blockNumber,
    event: event.event,
    data: event.data,
  }));
};

export const fetchGambaTransactionsFromHashes = async (
  provider: ethers.providers.Provider,
  txHashes: string[]
) => {
  const transactions = await Promise.all(
    txHashes.map(txHash => parseGambaTransaction(provider, txHash))
  );
  return transactions.flat();
};

export const fetchGambaTransactions = async (
  provider: ethers.providers.Provider,
  address: string,
  startBlock: number,
  endBlock: number
) => {
  const logs = await provider.getLogs({
    address,
    fromBlock: startBlock,
    toBlock: endBlock,
  });

  const events = parseTransactionEvents(logs);
  return events;
};
