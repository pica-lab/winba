import React, { useState } from "react";
import { ethers } from "ethers";
import { useSendTransaction } from "./hooks/useSendTransaction";

const SendTransactionComponent = () => {
  const { sendTransaction, isSending, error } = useSendTransaction();
  const [amount, setAmount] = useState("0.1"); // Example amount to send (in ETH)

  const handleSend = async () => {
    const value = ethers.utils.parseEther(amount); // Convert the amount to wei
    await sendTransaction("0xRecipientAddress", value); // Sending to a recipient
  };

  return (
    <div>
      <h2>Send Transaction</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isSending ? (
        <p>Sending transaction...</p>
      ) : (
        <button onClick={handleSend}>Send {amount} ETH</button>
      )}
    </div>
  );
};

export default SendTransactionComponent;
