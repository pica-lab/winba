import { Button, Dialog, Flex, Grid, Heading, IconButton, Text, TextField } from "@radix-ui/themes";
import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { decodeAta, getPoolJackpotTokenAccountAddress, isNativeMint } from "winba-core";
import { useAccount, useSendTransaction, useWalletAddress } from "winba-react";
import React from "react";
import { UiPool } from "@/views/Dashboard/PoolList";
import { TokenValue2 } from "@/components/TokenValue2";
import { useBalance, useToast } from "@/hooks";
import { useTokenMeta } from "@/hooks/useTokenMeta";

export function PoolJackpotDeposit({ pool }: { pool: UiPool }) {
  const [donateAmountText, setDonateAmountText] = React.useState("");
  const sendTransaction = useSendTransaction();
  const user = useWalletAddress();
  const toast = useToast();
  const token = useTokenMeta(pool.underlyingTokenMint);
  const balances = useBalance(pool.underlyingTokenMint);
  const amount = Math.round(Number(donateAmountText) * 10 ** token.decimals);

  const donateToJackpot = async () => {
    const { publicKey, state } = pool;
    const underlyingTokenMint = state.underlyingTokenMint;
    const userAta = getAssociatedTokenAddressSync(underlyingTokenMint, user);
    const poolJackpotAddress = getPoolJackpotTokenAccountAddress(publicKey);
    const transferInstruction = createTransferInstruction(userAta, poolJackpotAddress, user, amount);

    const instructions = isNativeMint(underlyingTokenMint)
      ? [transferInstruction]
      : [transferInstruction];

    await sendTransaction(instructions, { confirmation: "confirmed" });

    toast({
      title: "Donation Successful",
      description: "You have successfully donated to the jackpot.",
    });
  };

  return (
    <Grid gap="2">
      <Heading>Fund Jackpot</Heading>
      <Text color="gray">Donate {token.symbol} to this pool's jackpot.</Text>
      <TextField.Root>
        <TextField.Input
          placeholder="Amount"
          value={donateAmountText}
          size="3"
          onFocus={(e) => e.target.select()}
          onChange={(event) => setDonateAmountText(event.target.value)}
        />
        <TextField.Slot>
          <IconButton
            onClick={() => setDonateAmountText(String(balances.balance / 10 ** token.decimals))}
            size="1"
            variant="ghost"
          >
            MAX
          </IconButton>
        </TextField.Slot>
      </TextField.Root>
      <Flex justify="between">
        <Text size="2" color="gray">Balance</Text>
        <Text size="2">
          <TokenValue2 exact amount={balances.balance} mint={pool.underlyingTokenMint} />
        </Text>
      </Flex>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button size="3" variant="soft">Donate</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Grid gap="2">
            <Text>Donating to the Jackpot only serves to incentivize players. It is not possible to withdraw the money.</Text>
            <Dialog.Close>
              <Button size="3" color="red" variant="soft" onClick={donateToJackpot}>
                Donate <TokenValue2 exact amount={amount} mint={pool.underlyingTokenMint} />
              </Button>
            </Dialog.Close>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
    </Grid>
  );
}
