import { ProgramAccount } from "@coral-xyz/anchor";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { PoolState, getPoolLpAddress } from "winba-core"; // Updated from Gamba to Winba
import { useWinbaProgram } from "winba-react"; // Updated from Gamba to Winba
import React from "react";

import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Spinner } from "@/components/Spinner";
import { TokenValue2 } from "@/components/TokenValue2";
import { useTokenList } from "@/hooks";
import { useTokenMeta } from "@/hooks/useTokenMeta";
import { usePopulatedPool } from "@/views/Dashboard/PoolList";
import { useAddress } from "@thirdweb-dev/react"; // Updated to use Thirdweb

import { ConnectUserCard } from "../Debug/DebugUser";

interface Position {
  pool: ProgramAccount<PoolState>;
  lpBalance: number;
}

function PortfolioItem({ position }: { position: Position }) {
  const navigate = useNavigate();
  const { pool, lpBalance } = position;
  const populated = usePopulatedPool(pool);
  const ratio = populated.data?.ratio ?? 1;
  const token = useTokenMeta(pool.account.underlyingTokenMint);

  return (
    <Card key={pool.publicKey.toBase58()}>
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Avatar
            radius="full"
            fallback="?"
            size="3"
            color="green"
            src={token?.image || ''}
          />
          <Flex direction="column">
            <Text>{token.name}</Text>
            <Text>
              <TokenValue2
                mint={pool.account.underlyingTokenMint}
                amount={lpBalance * ratio}
              />
              {' - '}
              <TokenValue2
                dollar
                mint={pool.account.underlyingTokenMint}
                amount={lpBalance * ratio}
              />
            </Text>
          </Flex>
        </Flex>
        <Button onClick={() => navigate("/pool/" + pool.publicKey.toBase58())} variant="soft">
          View <ArrowRightIcon />
        </Button>
      </Flex>
    </Card>
  );
}

function Inner() {
  const program = useWinbaProgram(); // Updated to use Winba
  const { data: pools = [], isLoading: isLoadingPools } = useSWR("pools", () =>
    program.account.pool.all()
  );
  const tokens = useTokenList();

  const sortedPools = React.useMemo(
    () => {
      return pools
        .sort((a, b) => {
          const playsDiff = b.account.plays - a.account.plays;
          if (playsDiff) return playsDiff;
          const liqudityDiff = b.account.liquidityCheckpoint - a.account.liquidityCheckpoint;
          if (liqudityDiff) return liqudityDiff;
          return a.publicKey.toString() > b.publicKey.toString() ? 1 : -1;
        })
        .map(pool => {
          const lpAccount = tokens.find(t => t.mint.equals(getPoolLpAddress(pool.publicKey)));
          const lpBalance = lpAccount?.amount ?? 0;
          return { pool, lpBalance };
        })
        .filter(x => x.lpBalance > 0);
    },
    [pools, tokens],
  );

  return (
    <Card size="3">
      <Grid gap="4">
        <Heading>Portfolio</Heading>
        {isLoadingPools && (
          <Flex align="center" justify="center" p="4">
            <Spinner />
          </Flex>
        )}
        <Grid gap="2">
          {sortedPools.map(position => (
            <PortfolioItem key={position.pool.publicKey.toBase58()} position={position} />
          ))}
        </Grid>
      </Grid>
    </Card>
  );
}

export default function PortfolioView() {
  const address = useAddress(); // Updated to use Thirdweb for address check

  if (!address) {
    return <ConnectUserCard />;
  }

  return <Inner />;
}
