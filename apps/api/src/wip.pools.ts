import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { all } from './db';
import { createBatches } from './utils';
import { provider } from './web3';

const sdk = new ThirdwebSDK("optimism");

export const getAllPools = async () => {
  const changes = await all(`
    SELECT
      pc.block_time,
      pc.pool,
      pc.token,
      pc.post_liquidity AS liquidity,
      pc.post_liquidity * pc.usd_per_unit AS tvl
    FROM
      pool_changes pc
    JOIN (
      SELECT
        pool,
        MAX(block_time) AS max_block_time
      FROM
        pool_changes
      GROUP BY
        pool
    ) AS latest ON pc.pool = latest.pool
    AND pc.block_time = latest.max_block_time
    GROUP BY
      pc.pool
    ORDER BY
      pc.block_time DESC;
  `);

  const plays = await all(`
    SELECT
      pc.block_time,
      pc.pool,
      pc.token,
      pc.pool_liquidity AS liquidity
    FROM
      settled_games pc
    JOIN (
      SELECT
        pool,
        MAX(block_time) AS max_block_time
      FROM
        settled_games
      GROUP BY
        pool
    ) AS latest ON pc.pool = latest.pool
    AND pc.block_time = latest.max_block_time
    GROUP BY
      pc.pool
    ORDER BY
      pc.block_time DESC;
  `);

  const tokens = Array.from(new Set(changes.map((x) => x.token)));
  const prices = await getPrices(tokens, 30);

  const pools = await Promise.all(
    changes.map(async (poolChange) => {
      const lastPlay = plays.find((x) => x.pool === poolChange.pool);
      const mostRecent = lastPlay?.block_time > poolChange?.block_time ? lastPlay : poolChange;
      return {
        block_time: mostRecent.block_time,
        pool: mostRecent.pool,
        token: mostRecent.token,
        liquidity: mostRecent.liquidity,
        tvl: mostRecent.liquidity * prices[mostRecent.token].usdPerUnit,
      };
    })
  );

  const tvl = pools.reduce((tvl, pool) => tvl + pool.tvl, 0);

  return { pools: pools.sort((a, b) => b.tvl - a.tvl), tvl };
};

export const findAllPoolCreations = async () => {
  const sigs = (await all('select * from signatures')).map((x) => x.signature);
  const games = (await all('select signature from settled_games')).map((x) => x.signature);
  const changes = (await all('select signature from pool_changes')).map((x) => x.signature);
  const known = new Set([...games, ...changes]);

  const unknownSigs = sigs.filter((x) => !known.has(x));
  const batches = createBatches(unknownSigs, 100);

  let batchId = 0;
  for (const batch of batches) {
    const transactions = (await provider.getTransactionBatch(batch)).flatMap((x) => (x ? [x] : []));
    for (const tx of transactions) {
      const gambaIx = tx.data.instructions.find((x) => x.programId.equals(PROGRAM_ID));
      if (gambaIx) {
        const ix = sdk.decodeInstruction(gambaIx.data);
        if (ix.name === 'poolInitialize') {
          console.log('PoolTx', ix);
        }
      }
    }
    batchId++;
  }
};
