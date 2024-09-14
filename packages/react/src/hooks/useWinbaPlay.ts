import React, { useState } from "react";
import { useWinbaPlay } from "./hooks/useWinbaPlay";
import winbaAbi from "../abis/winbaAbi.json"; // ABI for Winba smart contract
import { ethers } from "ethers";

const contractAddress = "0xYourContractAddress"; // Replace with your contract address

const PlayGameComponent = () => {
  const { playGame, isPlaying, playError } = useWinbaPlay(contractAddress, winbaAbi);
  const [wager, setWager] = useState(ethers.utils.parseEther("0.1")); // Example wager
  const [clientSeed, setClientSeed] = useState("example_seed");
  const bet = [0, 1]; // Example bet array
  const poolAddress = "0xYourPoolAddress"; // Replace with your pool address
  const tokenAddress = "0xYourTokenAddress"; // Replace with the token address
  const creator = "0xCreatorAddress"; // Replace with the creator address
  const creatorFee = 100; // Example creator fee in basis points (1%)
  const jackpotFee = 200; // Example jackpot fee in basis points (2%)
  const metadata = "example_metadata";
  const useBonus = false;

  const handlePlayGame = async () => {
    await playGame(wager, bet, clientSeed, poolAddress, tokenAddress, creator, creatorFee, jackpotFee, metadata, useBonus);
  };

  return (
    <div>
      <h2>Play Game on Winba</h2>
      {playError && <p style={{ color: "red" }}>{playError}</p>}
      {isPlaying ? <p>Playing the game...</p> : <button onClick={handlePlayGame}>Play Game</button>}
    </div>
  );
};

export default PlayGameComponent;
