import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { config } from './config';

export const provider = new ethers.providers.JsonRpcProvider(config().OP_RPC_URL);
export const sdk = new ThirdwebSDK("optimism", {
  clientId: process.env.THIRDWEB_CLIENT_ID,
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});
