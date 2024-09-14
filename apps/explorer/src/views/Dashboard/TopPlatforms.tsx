import { TopCreatorsData, useApi } from "@/api";
import { PlatformAccountItem } from "@/components/AccountItem";
import { SkeletonCardList } from "@/components/Skeleton";
import { Badge, Card, Flex, Text } from "@radix-ui/themes";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const UnstyledNavLink = styled(NavLink)`
  text-decoration: none;
  cursor: pointer;
  color: unset;
`;

function PlatformTableRow({ platform, rank }: { platform: TopCreatorsData; rank: number }) {
  return (
    <UnstyledNavLink key={platform.creator} to={`/platform/${platform.creator}`}>
      <Card size="2">
        <Flex align="center" gap="4">
          <Text color="gray" style={{ opacity: 0.5 }}>
            {rank}
          </Text>
          <Flex justify="between" grow="1">
            <PlatformAccountItem avatarSize="1" address={platform.creator} />
            <Flex gap="2" align="center">
              <Text color="gray" size="2">
                ${platform.usd_volume.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Badge color="green">
                ~${platform.usd_revenue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Badge>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </UnstyledNavLink>
  );
}

export function TopPlatforms({ limit = 10, days = 7 }: { limit?: number; days?: number }) {
  const { data: platforms = [], isLoading } = useApi<TopCreatorsData[]>("/platforms", {
    limit,
    sortBy: "volume",
    days,
  });

  return (
    <Flex gap="2" direction="column">
      {isLoading ? (
        <SkeletonCardList cards={8} />
      ) : (
        <>
          {platforms.map((platform, i) => (
            <PlatformTableRow key={platform.creator} platform={platform} rank={i + 1} />
          ))}
        </>
      )}
    </Flex>
  );
}
