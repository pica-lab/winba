import { ArrowRightIcon, ExclamationTriangleIcon, PlusIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Callout, Card, Dialog, Flex, Grid, Heading, Link, ScrollArea, Switch, Text, TextField } from "@radix-ui/themes";
import { useSDK, useAddress } from "@thirdweb-dev/react"; // Updated to use Thirdweb Provider
import React from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { SelectableButton, TokenAvatar } from "@/components";
import { truncateString } from "@/components/AccountItem";
import { TokenValue2 } from "@/components/TokenValue2";
import { useTokenList } from "@/hooks"; // Assuming a custom hook for fetching tokens

// Updated logic to use Thirdweb SDK for pool creation on Optimism
async function createPool(sdk, selectedToken, isPrivate) {
  try {
    // Pool creation logic using Thirdweb and Optimism
    const contract = sdk.getContract("YOUR_CONTRACT_ADDRESS");
    await contract.call("createPool", selectedToken.mint, isPrivate);
    // Handle success (e.g., navigate to the new pool)
  } catch (error) {
    console.error("Error creating pool:", error);
  }
}

function SelectableToken(props: { token: any, selected: boolean, onSelect: () => void }) {
  const meta = useTokenMeta(props.token.mint);
  
  return (
    <SelectableButton selected={props.selected} onClick={props.onSelect}>
      <Flex justify="between">
        <Flex gap="4" align="center">
          <TokenAvatar mint={props.token.mint} />
          <Flex direction="column">
            <Text>{meta.name}</Text>
            <Text>{meta.symbol ?? truncateString(props.token.mint.toString())}</Text>
          </Flex>
        </Flex>
        <Flex direction="column" align="end" justify="end">
          <Text>
            <TokenValue2 mint={props.token.mint} amount={props.token.amount} />
          </Text>
        </Flex>
      </Flex>
    </SelectableButton>
  );
}

function Inner() {
  const sdk = useSDK(); // Access the Thirdweb SDK
  const walletAddress = useAddress(); // Get connected wallet address
  const navigate = useNavigate();
  const { data: tokenList = [] } = useSWR("token-list", fetchTokenList); // Fetch token list
  const [selectedToken, setSelectedToken] = React.useState(null);
  const [isPrivate, setPrivate] = React.useState(false);
  const [search, setSearch] = React.useState("");
  
  const filteredTokens = tokenList.filter(token => token.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Callout.Root>
        {/* Instructions for creating a pool */}
      </Callout.Root>

      <Text size="2" color="gray">Select the token you want to provide liquidity for</Text>

      <TextField.Root>
        <TextField.Input
          placeholder="Filter Tokens"
          value={search}
          size="3"
          onChange={(evt) => setSearch(evt.target.value)}
        />
      </TextField.Root>

      <ScrollArea style={{ maxHeight: "300px" }}>
        <Grid gap="1">
          {filteredTokens.map((token, i) => (
            <SelectableToken
              key={i}
              token={token}
              onSelect={() => setSelectedToken(token)}
              selected={!!selectedToken?.mint === token.mint}
            />
          ))}
        </Grid>
      </ScrollArea>

      <Flex align="center" justify="between">
        <Text>Private</Text>
        <Switch
          radius="full"
          checked={isPrivate}
          onCheckedChange={value => setPrivate(value)}
        />
      </Flex>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button
            size="3"
            color="green"
            variant="soft"
            disabled={!selectedToken || !sdk}
          >
            Create Pool <PlusIcon />
          </Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Flex direction="column" gap="2">
            <Heading>Read before creating!</Heading>
            {selectedToken && (
              <>
                {!isPrivate && <Text>Public Pool Warning: Your pool will be publicly visible.</Text>}
                {isPrivate && <Text>Private Pool Warning: Your pool will be private.</Text>}
              </>
            )}
            <Button size="3" variant="soft" color="green" onClick={() => createPool(sdk, selectedToken, isPrivate)}>
              Create Pool
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default function CreatePoolView() {
  const address = useAddress(); // Get wallet address from Thirdweb

  return address ? <Inner /> : <Text>Please connect your wallet</Text>;
}
