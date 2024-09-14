import { ArrowRightIcon, ExternalLinkIcon, MixIcon, ResetIcon } from "@radix-ui/react-icons";
import { Badge, Button, Card, Code, Flex, Grid, Heading, Table, Tabs, Text, TextField } from "@radix-ui/themes";
import { useSDK } from "@thirdweb-dev/react";  // Use Thirdweb SDK for interacting with blockchain
import React from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import useSWR from "swr";
import { TokenAvatar } from "@/components";
import { PlayerAccountItem } from "@/components/AccountItem";
import { Spinner } from "@/components/Spinner";
import { TokenValue2 } from "@/components/TokenValue2";
import { useTokenMeta } from "@/hooks";

const StyledOutcome = styled.div<{$rank: number, $active: boolean}>`
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

function Outcomes({bet, resultIndex}: {bet: number[], resultIndex: number}) {
  const uniqueOutcomes = Array.from(new Set(bet)).sort((a, b) => a > b ? 1 : -1);
  return (
    <Flex gap="1" wrap="wrap">
      {bet.map((x, i) => {
        const rank = Math.floor(uniqueOutcomes.indexOf(x) / (uniqueOutcomes.length - 1) * 7);
        const active = i === resultIndex;
        return (
          <StyledOutcome key={i} $rank={rank} $active={active}>
            {x}
          </StyledOutcome>
        );
      })}
    </Flex>
  );
}

async function fetchTransaction(sdk: any, txId: string) {
  const contract = sdk.getContract("YOUR_CONTRACT_ADDRESS");
  const transaction = await contract.call("getTransaction", txId);
  if (!transaction) throw new Error("Transaction doesn't exist");
  const parsed = transaction.parsedData;  // Custom parsed data depending on your contract
  const logs = transaction.logs ?? [];
  return { transaction, logs, parsed, isV1: false, notAGame: parsed?.name !== "GameSettled" };
}

export default function EmbeddedTransactionView() {
  const sdk = useSDK();  // Thirdweb SDK instance
  const params = useParams<{txid: string}>();
  const txId = params.txid!;
  const { data, isLoading, error } = useSWR("tx-" + txId, () => fetchTransaction(sdk, txId));

  if (isLoading) {
    return (
      <Flex align="center" justify="center" p="4">
        <Spinner />
      </Flex>
    );
  }

  if (error || !data) {
    return (
      <>
        Failed to fetch transaction: {JSON.stringify(error?.message)}
      </>
    );
  }

  if (data.parsed?.name !== "GameSettled") {
    return (
      <>
        <Heading mb="4">
          This transaction is not a game event
        </Heading>
        <Button onClick={() => window.open(`https://optimistic.etherscan.io/tx/${txId}`)}>
          View in Optimism explorer <ArrowRightIcon />
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
        <TransactionDetails parsed={data.parsed} />
        <VerificationSection parsed={data.parsed} />
      </Grid>
    </Tabs.Root>
  );
}
