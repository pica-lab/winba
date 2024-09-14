import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { db, all, get } from './db';
import { getPrices } from './price';
import { createBatches, getResultNumber } from './utils';

interface SignatureObject {
  signature: string;
  block_time: number;
}

const sdk = new ThirdwebSDK("optimism");
const provider = new ethers.providers.JsonRpcProvider(process.env.OP_RPC_URL);

const getSignatures = async (
  before?: SignatureObject,
  until?: SignatureObject,
  batch: SignatureObject[] = [],
): Promise<SignatureObject[]> => {
  const signatures = await provider.getBlockWithTransactions(before?.block_time);
  
  if (!signatures.length) {
    return batch;
  }

  const sigs = signatures.map((x) => ({ block_time: x.timestamp, signature: x.transactions[0].hash }));

  const nextBatch = [...batch, ...sigs].sort((a, b) => a.block_time - b.block_time);
  const nextBefore = nextBatch[0];

  if (nextBefore === before) {
    return nextBatch;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return await getSignatures(nextBefore, until, nextBatch);
};

const getRemainingSignatures = async () => {
  const latestGame = await get('select signature, block_time from settled_games order by block_time desc');
  const latestPoolChange = await get('select signature, block_time from pool_changes order by block_time desc');
  const latest = (latestGame?.block_time > latestPoolChange?.block_time
    ? latestGame?.block_time
    : latestPoolChange?.block_time) ?? 0;

  const remaining = await all('select * from signatures WHERE block_time >= :latest', { ':latest': latest });
  return remaining as SignatureObject[];
};

const storeEvents = async (events) => {
  const prices = await getPrices(events.map((x) => x.token));

  const insertGames = db.prepare(`
    INSERT OR IGNORE INTO settled_games (
      signature,
      block_time,
      metadata,
      nonce,
      client_seed,
      rng_seed,
      next_rng_seed_hashed,
      bet,
      bet_length,
      result_number,
      creator,
      user,
      token,
      pool,
      wager,
      payout,
      multiplier_bps,
      creator_fee,
      pool_fee,
      jackpot_fee,
      jackpot,
      pool_liquidity,
      usd_per_unit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  for (const event of events) {
    insertGames.run(
      event.signature,
      event.block_time,
      event.metadata,
      event.nonce,
      event.client_seed,
      event.rng_seed,
      event.next_rng_seed_hashed,
      event.bet,
      event.bet.length,
      event.result_number,
      event.creator,
      event.user,
      event.token,
      event.pool,
      event.wager,
      event.payout,
      event.multiplier_bps,
      event.creator_fee,
      event.pool_fee,
      event.jackpot_fee,
      event.jackpot,
      event.pool_liquidity,
      prices[event.token].usdPerUnit,
    );
  }
};

export async function sync() {
  try {
    await setupDb();
    await new Promise((resolve) => setTimeout(resolve, 10));
    await search();
  } catch (err) {
    console.error('❌ Sync error', err);
    console.log('Retrying sync...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sync();
  }
}
