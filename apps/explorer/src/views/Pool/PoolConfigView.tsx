import * as anchor from "@thirdweb-dev/anchor";
import { Button, Card, Flex, Grid, Heading, Text, TextField } from "@radix-ui/themes";
import { useSDK } from "@thirdweb-dev/react"; // Thirdweb integration
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { Spinner } from "@/components/Spinner";
import { fetchPool, UiPool } from "@/views/Dashboard/PoolList";
import { useTokenMeta } from "@/hooks/useTokenMeta";
import PoolGambaConfigDialog from "./PoolGambaConfig";
import { PoolHeader } from "./PoolHeader";

interface PoolConfigInput {
  minWager: string;
  customPoolFee: boolean;
  customPoolFeeBps: string;
  customMaxPayout: boolean;
  customMaxPayoutBps: string;
  depositWhitelistRequired: boolean;
  depositWhitelistAddress: string;
}

function PoolConfigDialog({ pool }: { pool: UiPool }) {
  const sdk = useSDK(); // Thirdweb SDK for interaction
  const [input, setInput] = useState<PoolConfigInput>({
    minWager: String(pool.state.minWager),
    customPoolFee: false,
    customPoolFeeBps: "100",
    customMaxPayout: false,
    customMaxPayoutBps: "5000",
    depositWhitelistRequired: false,
    depositWhitelistAddress: "",
  });

  const updateInput = (update: Partial<PoolConfigInput>) => setInput(prev => ({ ...prev, ...update }));

  const updateConfig = async () => {
    const contract = sdk.getContract("YOUR_CONTRACT_ADDRESS");
    await contract.call("updatePoolConfig", input.minWager, input.customPoolFeeBps, input.customMaxPayoutBps);
    mutate("pool-" + pool.publicKey);
  };

  return (
    <Card>
      <Heading>Pool Configuration</Heading>
      <Flex gap="2" direction="column">
        <TextField.Root>
          <TextField.Input
            value={input.minWager}
            onChange={e => updateInput({ minWager: e.target.value })}
            placeholder="Min Wager"
          />
        </TextField.Root>
        <Button onClick={updateConfig}>Update</Button>
      </Flex>
    </Card>
  );
}

export default function PoolConfigureView() {
  const sdk = useSDK(); // Thirdweb SDK
  const params = useParams<{ poolId: string }>();
  const poolId = React.useMemo(() => params.poolId!, [params.poolId]);
  const { data, isLoading } = useSWR("pool-" + poolId, () => fetchPool(sdk, poolId));

  if (isLoading) {
    return (
      <Flex align="center" justify="center" p="4">
        <Spinner />
      </Flex>
    );
  }

  return (
    <>
      {data && (
        <Grid gap="4">
          <Flex justify="between" align="end" py="4">
            <PoolHeader pool={data} />
          </Flex>
          <PoolConfigDialog pool={data} />
        </Grid>
      )}
    </>
  );
}
