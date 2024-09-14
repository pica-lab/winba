import { useTokenMeta } from "@/hooks/useTokenMeta"
import { Avatar, Card, Flex, Text } from "@radix-ui/themes"
import { PublicKey } from "@solana/web3.js"
import React, { PropsWithChildren } from "react"
import styled, { css } from "styled-components"
import { TokenValue2 } from "./TokenValue2"
import { OPAddress } from "./OPAddress"

export const SelectableButton = styled.button<{selected?: boolean}>`
  all: unset;
  display: block;
  border-radius: max(var(--radius-2), var(--radius-full));
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background .1s;
  ${props => props.selected ? css`
    background: var(--accent-a3);
  ` : css`
    &:hover {
      background: var(--accent-a2);
    }
    background: transparent;
    color: inherit;
  `}
`

interface TokenItemProps {
  mint: PublicKey
  balance: number
  stuff?: React.ReactNode
}

export function TokenAvatar(props: {mint: PublicKey | string, size?: "1" | "2" | "3"}) {
  const meta = useTokenMeta(props.mint)
  return (
    <Avatar
      radius="full"
      fallback="?"
      size={props.size ?? "3"}
      color="green"
      src={meta.image}
    />
  )
}

export function TokenName(props: {mint: PublicKey | string}) {
  const meta = useTokenMeta(props.mint)
  return <>{meta.name}</>
}

export function TokenItem({ mint, balance, stuff }: TokenItemProps) {
  const meta = useTokenMeta(mint)
  return (
    <Flex gap="4" justify="between" align="center">
      <Flex grow="1" gap="4" align="center">
        <TokenAvatar
          size="2"
          mint={meta.mint}
        />
        <Flex grow="1" direction="column">
          <Flex justify="between">
            <Text>
              {meta.name}
            </Text>
          </Flex>
          <Flex justify="between">
            <Text color="gray">
              <SolanaAddress plain truncate address={mint} />
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Text>
        <TokenValue2 mint={mint} amount={balance} />
      </Text>
      {stuff}
    </Flex>
  )
}

export function DetailCard(props: PropsWithChildren & { title: string }) {
  return (
    <Card>
      <Flex direction="column">
        <Text size="2" color="gray">
          {props.title}
        </Text>
        <Text weight="bold">
          {props.children}
        </Text>
      </Flex>
    </Card>
  )
}
