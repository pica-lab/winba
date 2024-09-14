import { ArrowRightIcon, CodeIcon, ExternalLinkIcon, InfoCircledIcon, MixIcon, ResetIcon } from "@radix-ui/react-icons";
import { Badge, Box, Button, Card, Code, Dialog, Flex, Grid, Heading, IconButton, Link, Table, Tabs, Text, TextField } from "@radix-ui/themes";
import { useSDK } from "@thirdweb-dev/react"; // Thirdweb SDK
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import useSWR from "swr";
import { DetailCard, TokenAvatar } from "@/components";
import { PlatformAccountItem, PlayerAccountItem } from "@/components/AccountItem";
import { Spinner } from "@/components/Spinner";
import { TokenValue2 } from "@/components/TokenValue2";
import { useTokenMeta } from "@/hooks";
import { fetchWinbaTransaction } from "@/utils"; // Assuming utility function for fetching transactions in Winba

const StyledOutcome = styled.div<{ $rank: number, $active: boolean }>`
  --rank-0: #ff293b;
  --rank-1: #ff7142;
  --rank-2: #ffa557;
  --rank-3: #ffa557;
  --rank-4: #ffd166;
  --rank-5: #fff875;
  --rank-6: #e1ff80;
  --rank-7: #60ff9b;
  background-color: var(--slate-2);
  padding: 5px 10px;
  min-width: 2em;
  text-align: center;
  position: relative;
  border-radius: max(var(--radius-1), var(--radius-full));
  overflow: hidden;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    opacity: .05;
  }

  ${props => props.$active && css`
    box-shadow: 0 0 0 1px currentColor;
    &:before {
      opacity: .15;
    }
  `}

  ${props => css`
    color: var(--rank-${props.$rank});
    &:before {
      background-color: var(--rank-${props.$rank});
    }
  `}
`;

function Outcomes({ bet, resultIndex }: { bet: number[], resultIndex: number }) {
  const uniqueOutcomes = Array.from(new Set(bet)).sort((a, b) => (a > b ? 1 : -1));
  return (
    <Flex gap="1" wrap="wrap">
      {bet.map((x, i) => {
        const rank = Math.floor(uniqueOutcomes.indexOf(x) / (uniqueOutcomes.length - 1) * 7);
        const active = i === resultIndex;
        return <StyledOutcome key={i} $rank={rank} $active={active}>{x}</StyledOutcome>;
      })}
    </Flex>
  );
}

export default function EmbeddedTransactionView() {
  const sdk = useSDK(); // Thirdweb SDK instance
  const params = useParams<{ txid: string }>();
  const txId = params.txid!;
  const { data, isLoading, error } = useSWR("tx-" + txId, () => fetchWinbaTransaction(sdk, txId));

  if (isLoading) {
    return (
      <Flex align="center" justify="center" p="4">
        <Spinner />
      </Flex>
    );
  }

  if (error || !data) {
    return <>Failed to fetch transaction: {JSON.stringify(error?.message)}</>;
  }

  if (data.parsed?.name !== 'GameSettled') {
    return (
      <>
        <Heading mb="4">This transaction is not a game event</Heading>
        <Button onClick={() => window.open('https://explorer.optimism.io/tx/' + txId)}>
          View in Optimism Explorer <ArrowRightIcon />
        </Button>
      </>
    );
  }

  const game = data.parsed.data;
  const moreThanOne = game.bet.filter(x => x >= 1);
  const sum = game.bet.reduce((p, x) => p + x, 0) / 10_000;
  const winChange = moreThanOne.length / game.bet.length;
  const potentialWin = Math.max(...game.bet);
  const oddsScore = sum / game.bet.length;

  return (
    <Tabs.Root defaultValue="details">
      <Grid gap="4">
        <Tabs.List size="2">
          <Tabs.Trigger value="details">Details</Tabs.Trigger>
          <Tabs.Trigger value="verification">Proof</Tabs.Trigger>
          <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="details">
          <Grid gap="4">
            <Flex wrap="wrap" gap="2">
              <DetailCard title="Win change">{(winChange * 100).toLocaleString(undefined, { maximumFractionDigits: 3 })}%</DetailCard>
              <DetailCard title="Max win"><TokenValue2 mint={game.tokenMint} amount={game.wager * (potentialWin / 10000)} /></DetailCard>
              <DetailCard title="Max multiplier">{(potentialWin / 10000)}x</DetailCard>
              <DetailCard title="House edge">{parseFloat((100 - oddsScore * 100).toFixed(1))}%</DetailCard>
            </Flex>
            <TransactionDetails parsed={data.parsed} />
          </Grid>
        </Tabs.Content>
        <Tabs.Content value="verification">
          <VerificationSection parsed={data.parsed} />
        </Tabs.Content>
        <Tabs.Content value="logs">
          <Card>
            <Grid gap="2">
              <Flex direction="column" gap="1">
                {data.logs.map((x, i) => <Code style={{ wordBreak: 'break-all' }} size="1" key={i}>{x}</Code>)}
              </Flex>
            </Grid>
          </Card>
        </Tabs.Content>
      </Grid>
    </Tabs.Root>
  );
}
