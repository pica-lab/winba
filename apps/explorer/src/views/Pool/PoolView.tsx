import { ExternalLinkIcon, PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import { Badge, Box, Button, Card, Dialog, Flex, Grid, Heading, Link, Switch, Tabs, Text } from "@radix-ui/themes";
import { PublicKey } from "ethers";
import { useAccount, useProgram, usePool } from "winba-react"; // Updated to Winba
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import RecentPlays, { TimeDiff } from "@/RecentPlays";
import { PoolChangesResponse, apiFetcher, getApiUrl } from "@/api";
import { useBalance } from "@/hooks";
import { UiPool, fetchPool } from "@/views/Dashboard/PoolList";
import { DetailCard } from "@/components";
import { SkeletonCard } from "@/components/Skeleton";
import { TokenValue2 } from "@/components/TokenValue2";
import { useTokenMeta } from "@/hooks/useTokenMeta";
import useSWRInfinite from "swr/infinite";

import { ConnectUserCard } from "../Debug/DebugUser";
import { PoolCharts } from "./PoolCharts";
import { PoolHeader } from "./PoolHeader";
import { PoolJackpotDeposit } from "./PoolJackpotDeposit";
import { PoolMintBonus } from "./PoolMintBonus";
import { PoolWithdraw } from "./PoolWithdraw";

export function usePoolId() {
  const params = useParams<{ poolId: string }>();
  return React.useMemo(() => new PublicKey(params.poolId!), [params.poolId]);
}

function LinkWarningDialog(props: React.PropsWithChildren<{ url: string }>) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{props.children}</Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Do your own research.</Dialog.Title>
        <Dialog.Description size="2">
          You are about to leave the platform. Ensure the external link is safe.
        </Dialog.Description>
        <Dialog.Footer>
          <Button asChild>
            <Link href={props.url} target="_blank">
              Proceed to External Link
            </Link>
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function PoolManager({ pool }: { pool: UiPool }) {
  const balances = useBalance(pool.underlyingTokenMint);
  const token = useTokenMeta(pool.underlyingTokenMint);
  const navigate = useNavigate();

  return (
    <Flex direction="column" gap="4">
      <PoolHeader pool={pool} />
      <Grid gap="4" columns={{ initial: "1", sm: "2" }}>
        <DetailCard title="Liquidity">
          <TokenValue2 mint={pool.underlyingTokenMint} amount={pool.liquidity} />
        </DetailCard>
        <DetailCard title="Max Payout">
          <TokenValue2 mint={pool.underlyingTokenMint} amount={pool.maxPayout} />
        </DetailCard>
        <DetailCard title="Circulating Bonus">
          <TokenValue2 mint={pool.underlyingTokenMint} amount={pool.bonusBalance} />
        </DetailCard>
        <DetailCard title="Jackpot">
          <TokenValue2 exact mint={pool.underlyingTokenMint} amount={Number(pool.jackpotBalance)} />
        </DetailCard>
        <DetailCard title="Total Plays">
          {pool.plays.toLocaleString(undefined)}
        </DetailCard>
      </Grid>

      <PoolCharts pool={pool} />

      {balances.lpBalance > 0 ? (
        <Card size="3">
          <Grid gap="2">
            <Text color="gray">Your position</Text>
            <Text size="5" weight="bold">
              <TokenValue2 dollar mint={pool.underlyingTokenMint} amount={balances.lpBalance * pool.ratio} />
            </Text>
            <Text>
              <TokenValue2 exact mint={pool.underlyingTokenMint} amount={balances.lpBalance} suffix="LP" />
            </Text>
            <PoolWithdraw pool={pool} />
          </Grid>
        </Card>
      ) : (
        <Card size="3">
          <Grid gap="4" align="center" justify="center">
            <Heading align="center">No position</Heading>
            <Text align="center" color="gray">
              You can stake your {token?.symbol} in this pool.
            </Text>
            <Flex align="center" justify="center">
              <Button onClick={() => navigate("/pool/" + pool.publicKey.toBase58() + "/deposit")} size="3">
                Deposit <RocketIcon />
              </Button>
            </Flex>
          </Grid>
        </Card>
      )}

      <Tabs.Root defaultValue="plays">
        <Tabs.List>
          <Tabs.Trigger value="plays">Recent plays</Tabs.Trigger>
          <Tabs.Trigger value="deposits">Deposits</Tabs.Trigger>
        </Tabs.List>
        <Box pt="4">
          <Tabs.Content value="plays">
            <PoolRecentPlays pool={pool} />
          </Tabs.Content>
          <Tabs.Content value="deposits">
            <PoolDeposits pool={pool} />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}

export default function PoolView() {
  const program = useProgram();
  const poolId = usePoolId();
  const { data, isLoading } = useSWR("pool-" + poolId.toString(), () => fetchPool(program.provider.connection, poolId));

  if (isLoading) {
    return (
      <Flex align="center" justify="center" p="4">
        <Spinner />
      </Flex>
    );
  }

  return <>{data && <PoolManager pool={data} />}</>;
}
