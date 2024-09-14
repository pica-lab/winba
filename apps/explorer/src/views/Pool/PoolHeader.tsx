import { GearIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Dialog, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { decodeWinbaState, getWinbaStateAddress, getPoolBonusAddress, getPoolLpAddress } from "winba-core";
import { useAccount, useWalletAddress } from "winba-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { TokenAvatar } from "@/components";
import { useTokenMeta } from "@/hooks/useTokenMeta";
import { UiPool } from "../Dashboard/PoolList";

export function PoolHeader({ pool }: { pool: UiPool }) {
  const token = useTokenMeta(pool.underlyingTokenMint);
  const winbaState = useAccount(getWinbaStateAddress(), decodeWinbaState);
  const userPublicKey = useWalletAddress();
  const navigate = useNavigate();
  const isPoolAuthority = pool?.poolAuthority?.equals(userPublicKey);
  const isWinbaStateAuthority = winbaState?.authority?.equals(userPublicKey);

  return (
    <Flex gap="4" align="center">
      <NavLink to={"/pool/" + pool.publicKey.toBase58()} style={{ display: "contents", color: "unset" }}>
        <TokenAvatar size="3" mint={pool.underlyingTokenMint} />
        <Flex align="center" gap="2">
          <Heading>{token.name}</Heading>
          <Text color="gray" size="4">
            {token.symbol}
          </Text>
        </Flex>
      </NavLink>
      {(isPoolAuthority || isWinbaStateAuthority) && (
        <IconButton size="2" variant="ghost" onClick={() => navigate("/pool/" + pool.publicKey.toString() + "/configure")}>
          <GearIcon />
        </IconButton>
      )}
      <Dialog.Root>
        <Dialog.Trigger>
          <IconButton size="2" variant="ghost">
            <InfoCircledIcon />
          </IconButton>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Pool Details</Dialog.Title>
          <Dialog.Description>
            <Flex direction="column">
              <Text color="gray" size="2">Token mint</Text>
              <Text>{pool.underlyingTokenMint.toString()}</Text>
            </Flex>
            <Flex direction="column">
              <Text color="gray" size="2">LP Token mint</Text>
              <Text>{getPoolLpAddress(pool.publicKey).toString()}</Text>
            </Flex>
            <Flex direction="column">
              <Text color="gray" size="2">Bonus Token mint</Text>
              <Text>{getPoolBonusAddress(pool.publicKey).toString()}</Text>
            </Flex>
            <Flex direction="column">
              <Text color="gray" size="2">Pool Address</Text>
              <Text>{pool.publicKey.toString()}</Text>
            </Flex>
            <Flex direction="column">
              <Text color="gray" size="2">Pool Authority</Text>
              <Text>{pool?.poolAuthority?.toString()}</Text>
            </Flex>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
