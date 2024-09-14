import * as anchor from "@thirdweb-dev/sdk"; // Thirdweb SDK for contract interaction
import { Button, Flex, Grid, Heading, Text, TextField } from "@radix-ui/themes";
import { useWallet } from "@thirdweb-dev/react"; // Thirdweb Wallet Provider
import { BPS_PER_WHOLE } from "winba-core"; // Import Winba core dependencies
import { useSendTransaction } from "winba-react"; // Use Winba React for sending transactions
import React, { useState } from "react";
import { mutate } from "swr";
import { UiPool } from "@/views/Dashboard/PoolList"; // Importing PoolList for UI

// Define a component for rendering labels and fields
const Thing = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Grid columns="2">
    <Text>{title}</Text>
    {children}
  </Grid>
);

// Define Pool Configuration input types
interface PoolConfigInput {
  antiSpamFeeExemption: boolean;
  customWinbaFeeEnabled: boolean;
  customWinbaFeePercent: string; // Fee percentage
}

// Main function to configure the pool settings
export default function PoolWinbaConfigDialog({ pool }: { pool: UiPool }) {
  const sendTx = useSendTransaction(); // Use the send transaction hook
  const { address: publicKey } = useWallet(); // Use wallet to get public address

  // State for handling form inputs
  const [input, setInput] = useState<PoolConfigInput>({
    antiSpamFeeExemption: pool.state.antiSpamFeeExempt,
    customWinbaFeeEnabled: pool.state.customWinbaFee,
    customWinbaFeePercent: String(pool.state.customWinbaFeeBps / BPS_PER_WHOLE * 100), // Convert basis points to percentage
  });

  // Update the form inputs dynamically
  const updateInput = (update: Partial<PoolConfigInput>) => {
    setInput(prevInput => ({ ...prevInput, ...update }));
  };

  // Function to handle configuration updates
  const updateConfig = async () => {
    const { antiSpamFeeExemption, customWinbaFeeEnabled, customWinbaFeePercent } = input;
    const customWinbaFeeBps = parseFloat(customWinbaFeePercent) / 100 * BPS_PER_WHOLE; // Convert to basis points

    // Send the transaction using the Thirdweb provider
    await sendTx(
      program.methods.poolWinbaConfig(
        antiSpamFeeExemption,
        customWinbaFeeEnabled,
        new anchor.BN(customWinbaFeeBps)
      ).accounts({ user: publicKey!, pool: pool.publicKey }).instruction(),
      { confirmation: "confirmed" }
    );

    // Mutate the pool state to update
    mutate("pool-" + pool.publicKey.toBase58());
  };

  return (
    <>
      <Heading>Winba Config</Heading>
      <Flex gap="2" direction="column">
        <Thing title="Anti Spam Fee Exemption">
          <input
            type="checkbox"
            checked={input.antiSpamFeeExemption}
            onChange={e => updateInput({ antiSpamFeeExemption: e.target.checked })}
          />
        </Thing>

        <Thing title="Enable Custom Winba Fee">
          <input
            type="checkbox"
            checked={input.customWinbaFeeEnabled}
            onChange={e => updateInput({ customWinbaFeeEnabled: e.target.checked })}
          />
        </Thing>

        <Thing title="Custom Winba Fee (%)">
          <TextField.Root>
            <TextField.Input
              value={input.customWinbaFeePercent}
              onChange={e => updateInput({ customWinbaFeePercent: e.target.value })}
              type="number"
              step="0.01"
              disabled={!input.customWinbaFeeEnabled}
              placeholder="Enter fee percentage"
            />
          </TextField.Root>
        </Thing>

        <Button onClick={updateConfig}>Update</Button>
      </Flex>
    </>
  );
}
