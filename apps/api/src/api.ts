import express from 'express';
import apicache from 'apicache';
import { z } from 'zod';
import { all, get } from './db';
import { validate } from './utils';
import { ThirdwebSDK } from "@thirdweb-dev/sdk"; // Thirdweb SDK for OP chain
import { ethers } from "ethers";
import { config } from './config';

const cache = apicache.middleware;
const api = express.Router();
const slow = () => (_, __, next) => next(); // Use this to simulate delay if needed

// Initialize Thirdweb SDK for Optimism
const sdk = new ThirdwebSDK("optimism", {
  clientId: process.env.THIRDWEB_CLIENT_ID, // Use your actual Thirdweb Client ID
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

const provider = new ethers.providers.JsonRpcProvider(process.env.OP_RPC_URL);

// Schema validation using Zod
const poolChangesSchema = z.object({ query: z.object({ pool: z.string().optional() }) });
const volumeSchema = z.object({ query: z.object({ pool: z.string({}) }) });
const ratioSchema = z.object({ query: z.object({ pool: z.string({}) }) });

// Utility for date calculations
export const daysAgo = (daysAgo: number) => {
  const now = new Date();
  const then = new Date();
  then.setDate(now.getDate() - daysAgo);
  then.setHours(1);
  return then.getTime();
};

// API Route for fetching recent pool changes
api.get('/events/poolChanges', slow(), validate(poolChangesSchema), async (req, res) => {
  const results = await all(`
    SELECT
      signature,
      action,
      amount,
      user,
      token,
      pool,
      lp_supply,
      post_liquidity,
      block_time * 1000 as time
    FROM pool_changes
    WHERE pool = ?
    ORDER BY block_time DESC LIMIT 20;
  `, [req.query.pool]);

  res.send({ results });
});

// Example of using Thirdweb to interact with the OP chain
api.get('/fetch-wallet-balance', async (req, res) => {
  try {
    const wallet = sdk.wallet.connect(provider); // Connect to the OP chain
    const balance = await wallet.getBalance();
    res.send({ balance: ethers.utils.formatEther(balance) });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).send({ error: 'Failed to fetch wallet balance' });
  }
});

export default api;
