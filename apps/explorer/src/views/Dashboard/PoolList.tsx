import { TokenAvatar } from "@/components";
import { SkeletonFallback, SkeletonText } from "@/components/Skeleton";
import { TableRowNavLink } from "@/components/TableRowLink";
import { TokenValue2 } from "@/components/TokenValue2";
import { useSDK } from "@thirdweb-dev/react"; // Thirdweb SDK for contract interactions
import { Flex, Table, Text } from "@radix-ui/themes";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

const StyledTableCell = styled(Table.Cell)`
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

export interface UiPool {
  address: string;
  tokenMint: string; // Ethereum token address
  liquidity: bigint;
  lpSupply: bigint;
  bonusBalance: bigint;
  jackpotBalance: bigint;
  plays: number;
  tvl: number;
}

const fetchPools = async (sdk: any) => {
  // Example function to fetch pools using Thirdweb SDK
  const contract = sdk.getContract("YOUR_CONTRACT_ADDRESS");
  const pools = await contract.call("getPools");
  return pools.map((pool: any) => ({
    address: pool.address,
    tokenMint: pool.tokenMint,
    liquidity: pool.liquidity,
    lpSupply: pool.lpSupply,
    bonusBalance: pool.bonusBalance,
    jackpotBalance: pool.jackpotBalance,
    plays: pool.plays,
    tvl: pool.tvl,
  }));
};

export function PoolList() {
  const sdk = useSDK(); // Thirdweb SDK instance
  const { data: pools = [], isLoading } = useSWR("pools", () => fetchPools(sdk));

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Pool</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Liquidity</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>TVL</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Plays</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <Table.Row key={i}>
                <StyledTableCell>
                  <Flex gap="4" align="center">
                    <SkeletonText style={{ width: "150px" }} />
                  </Flex>
                </StyledTableCell>
                {Array.from({ length: 3 }).map((_, i) => (
                  <StyledTableCell key={i}>
                    <SkeletonText />
                  </StyledTableCell>
                ))}
              </Table.Row>
            ))}
          </>
        ) : (
          <>
            {pools.map((pool) => (
              <TableRowNavLink key={pool.address} to={`/pool/${pool.address}`}>
                <Table.Row>
                  <StyledTableCell>
                    <Flex gap="4" align="center">
                      <TokenAvatar mint={pool.tokenMint} />
                      <Text>{pool.tokenMint.substring(0, 6)}...{pool.tokenMint.slice(-4)}</Text>
                    </Flex>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TokenValue2 mint={pool.tokenMint} amount={pool.liquidity} />
                  </StyledTableCell>
                  <StyledTableCell>
                    <TokenValue2 mint={pool.tokenMint} amount={pool.tvl} />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Text>{pool.plays}</Text>
                  </StyledTableCell>
                </Table.Row>
              </TableRowNavLink>
            ))}
          </>
        )}
      </Table.Body>
    </Table.Root>
  );
}
