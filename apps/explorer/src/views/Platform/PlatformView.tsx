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
import { usePlatformMeta, useTokenMeta } from "@/hooks";
import { useSDK, useAddress } from "@thirdweb-dev/react"; // Added for Thirdweb integration
import styled from "styled-components";
import { TopPlayers, TotalVolume } from "../Dashboard/Dashboard";

const OnlineIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #22ff63;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5em;
  vertical-align: middle;
  @keyframes online-indicator-pulsing {
    0%, 25%, 75%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  animation: online-indicator-pulsing infinite 1s;
`;

export function DetailCards({ creator, startTime = 0 }: { creator?: string, startTime?: number }) {
  const { data, isLoading } = useApi<StatsResponse>('/stats', { creator: creator?.toString(), startTime });
  
  return (
    <Flex gap="2" wrap="wrap">
      <DetailCard title="Volume">
        <SkeletonFallback loading={isLoading}>
          ${data?.usd_volume?.toLocaleString()}
        </SkeletonFallback>
      </DetailCard>
      <DetailCard title="Estimated Fees">
        <SkeletonFallback loading={isLoading}>
          ${data?.revenue_usd?.toLocaleString()}
        </SkeletonFallback>
      </DetailCard>
      <DetailCard title="Plays">
        <SkeletonFallback loading={isLoading}>
          {data?.plays?.toLocaleString()}
        </SkeletonFallback>
      </DetailCard>
      <DetailCard title="Players">
        <SkeletonFallback loading={isLoading}>
          {data?.players?.toLocaleString()}
        </SkeletonFallback>
      </DetailCard>
      {data && data.active_players > 0 && (
        <DetailCard title="Active players">
          <OnlineIndicator />
          <SkeletonFallback loading={isLoading}>
            {data?.active_players?.toLocaleString()}
          </SkeletonFallback>
        </DetailCard>
      )}
    </Flex>
  );
}

function LinkWarningDialog(props: { url: string }) {
  return (
    <Dialog.Root>
      {/* Dialog content */}
    </Dialog.Root>
  );
}

export default function PlatformView() {
  const { address } = useParams<{ address: string }>();
  const sdk = useSDK(); // Thirdweb SDK for contract interactions
  const walletAddress = useAddress(); // Connected wallet address
  
  const platformMeta = usePlatformMeta(address); // Fetch platform metadata
  const tokenMeta = useTokenMeta(platformMeta?.tokenMint); // Fetch token metadata

  return (
    <Container>
      <Grid gap="4">
        <Flex direction="column" gap="4">
          <DetailCards creator={address} />
          <Card>
            <Flex justify="between">
              <Text color="gray">Platform Overview</Text>
              <Link asChild>
                <NavLink to={`/platform/${address}`}>View Details</NavLink>
              </Link>
            </Flex>
          </Card>
          <RecentPlays creator={address!} />
        </Flex>
      </Grid>
    </Container>
  );
}
