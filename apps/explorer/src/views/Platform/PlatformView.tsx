import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Card, Container, Dialog, Flex, Grid, Link, Text } from "@radix-ui/themes";
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import RecentPlays from "@/RecentPlays";
import { PlatformTokenResponse, StatsResponse, useApi } from "@/api";
import { DetailCard, TokenAvatar } from "@/components";
import { truncateString } from "@/components/AccountItem";
import { Details } from "@/components/Details";
import { SkeletonCardList, SkeletonFallback } from "@/components/Skeleton";
import { useTokenMeta } from "@/hooks";
import { useSDK } from "@thirdweb-dev/react"; // Thirdweb SDK for Optimism

function PlatformHeader({ creator }: { creator: string }) {
  const meta = useTokenMeta(creator);
  return (
    <Flex gap="4" align="center">
      <Avatar size="2" src={meta.image ?? ""} fallback="" />
      {meta.name ?? truncateString(creator)}
    </Flex>
  );
}

export function PlatformView() {
  const { address } = useParams<{ address: string }>();
  const { data: tokens = [], isLoading } = useApi<PlatformTokenResponse>("/tokens", { creator: address });
  const sdk = useSDK(); // Access Thirdweb SDK

  return (
    <Container>
      <Flex direction="column" gap="4">
        <Flex justify={{ sm: "between" }} align={{ sm: "end" }} py="4" direction={{ initial: "column", sm: "row" }} gap="4">
          <PlatformHeader creator={address!} />
        </Flex>
        <DetailCards creator={address} />
        <Grid gap="4" columns={{ initial: "1", sm: "2" }}>
          <Flex gap="4" direction="column">
            <TotalVolume creator={address!} />
            <PlatformDetails creator={address!} />
          </Flex>
          <Flex gap="4" direction="column">
            <Card>
              <Flex gap="2" direction="column">
                <Text color="gray">Volume by token</Text>
                <Flex direction="column" gap="2">
                  {isLoading && !tokens.length && <SkeletonCardList cards={3} />}
                  {tokens.map((token, i) => (
                    <TokenVolume key={i} token={token} />
                  ))}
                </Flex>
              </Flex>
            </Card>
            <Card>
              <Flex gap="2" direction="column">
                <Flex justify="between">
                  <Text color="gray">7d Leaderboard</Text>
                  <Link asChild>
                    <NavLink to={`/leaderboard?creator=${address}`}>View all</NavLink>
                  </Link>
                </Flex>
                <TopPlayers creator={address!} />
              </Flex>
            </Card>
          </Flex>
        </Grid>
        <Text color="gray">Recent plays</Text>
        <RecentPlays creator={address!} />
      </Flex>
    </Container>
  );
}
