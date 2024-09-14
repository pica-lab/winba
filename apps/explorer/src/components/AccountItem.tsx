import { useAddress, useEnsName } from "@thirdweb-dev/react"; // Thirdweb hooks for Ethereum
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { AvatarProps } from "@radix-ui/themes/dist/cjs/components/avatar";
import { minidenticon } from 'minidenticons';
import React from "react";

interface AccountItemProps {
  address: string;
  name?: string;
  image?: string;
  color?: AvatarProps["color"];
  avatarSize?: AvatarProps["size"];
}

export const truncateString = (s: string, startLen = 4, endLen = startLen) => s.slice(0, startLen) + "..." + s.slice(-endLen);

type AccountItemProps2 = Pick<AccountItemProps, "avatarSize" | "address">;

export function PlatformAccountItem(props: AccountItemProps2) {
  const ensName = useEnsName(props.address); // Use ENS name from Thirdweb
  return (
    <AccountItem
      {...props}
      name={ensName}
    />
  );
}

export function Identicon(props: AccountItemProps2) {
  const image = React.useMemo(() => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(props.address)), [props.address]);
  return (
    <Avatar
      size={props.avatarSize ?? "1"}
      src={image}
      fallback={props.address.substring(0, 2)}
    />
  );
}

export function PlayerAccountItem(props: AccountItemProps2) {
  const ensName = useEnsName(props.address);
  const image = React.useMemo(() => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(props.address)), [props.address]);
  return (
    <AccountItem
      color="orange"
      {...props}
      name={ensName}
      image={image}
    />
  );
}

export function AccountItem({ address, name, image, color, avatarSize }: AccountItemProps) {
  return (
    <Flex gap="2" align="center">
      <Avatar
        size={avatarSize ?? "1"}
        color={color}
        src={image}
        fallback={address.substring(0, 2)}
      />
      <Text>
        {name ?? truncateString(address)}
      </Text>
    </Flex>
  );
}
