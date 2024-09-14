import React from "react";
import { ethers } from "ethers";
import { useCurrentPool } from "./hooks/useCurrentPool";
import poolAbi from "../abis/poolAbi.json";  // Replace with the actual ABI of your pool contract

const contractAddress = "0xYourContractAddress";  // Replace with the contract address
const poolAddress = "0xYourPoolAddress";  // Replace with the pool address

const CurrentPoolComponent = () => {
  const { poolInfo, isLoading, error } = useCurrentPool(contractAddress, poolAbi, poolAddress);

  return (
    <div>
      <h2>Current Pool Information</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading ? (
        <p>Loading pool information...</p>
      ) : (
        poolInfo && (
          <div>
            <p>Pool Address: {poolInfo.poolAddress}</p>
            <p>Liquidity: {ethers.utils.formatEther(poolInfo.liquidity)} ETH</p>
            <p>Total Players: {poolInfo.totalPlayers.toString()}</p>
            <p>Total Games: {poolInfo.totalGames.toString()}</p>
          </div>
        )
      )}
    </div>
  );
};

export default CurrentPoolComponent;
