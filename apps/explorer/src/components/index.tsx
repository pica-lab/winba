import { useTokenBalance, useAddress } from "@thirdweb-dev/react";
import { Avatar, Card, Flex, Text } from "@radix-ui/themes";
import React, { PropsWithChildren } from "react";
import styled, { css } from "styled-components";
import { TokenValue2 } from "./TokenValue2";
import { OPAddress } from "./OPAddress"; // Updated to handle Ethereum addresses

export const SelectableButton = styled.button<{ selected?: boolean }>`
  all: unset;
  display: block;
  border-radius: max(var(--radius-2), var(--radius-full));
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background .1s;
  ${(props) =>
    props.selected
      ? css`
          background: var(--accent-a3);
        `
      : css`
          &:hover {
            background: var(--accent-a2);
          }
          background: transparent;
          color: inherit;
        `}
`;

interface TokenItemProps {
  mint: string; // Ethereum address
  balance: number;
  stuff?: React.ReactNode;
}

export function TokenAvatar(props: { mint: string; size?: "1" | "2" | "3" }) {
  const balance = useTokenBalance(props.mint); // Use Thirdweb hook for token balance
  return (
    <Avatar
      radius="full"
      fallback="?"
      size={props.size ?? "3"}
      color="green"
      src={balance.data?.tokenMetadata?.image} // Assuming Thirdweb provides token metadata
    />
  );
}

export function TokenName(props: { mint: string }) {
  const balance = useTokenBalance(props.mint);
  return <>{balance.data?.tokenMetadata?.name ?? "Token"}</>;
}

export function TokenItem({ mint, balance, stuff }: TokenItemProps) {
  const tokenBalance = useTokenBalance(mint); // Fetch token balance using Thirdweb Provider

  return (
    <Flex gap="4" justify="between" align="center">
      <Flex grow="1" gap="4" align="center">
        <TokenAvatar size="2" mint={mint} />
        <Flex grow="1" direction="column">
          <Flex justify="between">
            <Text>{tokenBalance.data?.tokenMetadata?.name ?? "Token"}</Text>
          </Flex>
          <Flex justify="between">
            <Text color="gray">
              <OPAddress plain truncate address={mint} />
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Text>
        <TokenValue2 mint={mint} amount={balance} />
      </Text>
      {stuff}
    </Flex>
  );
}

export function DetailCard(props: PropsWithChildren & { title: string }) {
  return (
    <Card>
      <Flex direction="column">
        <Text size="2" color="gray">
          {props.title}
        </Text>
        <Text weight="bold">{props.children}</Text>
      </Flex>
    </Card>
  );
}
