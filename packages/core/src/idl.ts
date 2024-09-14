```typescript
export const IDL = {
  version: '0.1.0',
  name: 'winba',
  instructions: [
    {
      name: 'winbaInitialize',
      accounts: [
        {
          name: 'initializer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'winbaState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'winbaSetAuthority',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'winbaState',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'authority',
          type: 'address',
        },
      ],
    },
    {
      name: 'winbaSetConfig',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'winbaState',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'rngAddress',
          type: 'address',
        },
        {
          name: 'winbaFee',
          type: 'uint256',
        },
        {
          name: 'maxCreatorFee',
          type: 'uint256',
        },
        {
          name: 'poolCreationFee',
          type: 'uint256',
        },
        {
          name: 'antiSpamFee',
          type: 'uint256',
        },
        {
          name: 'maxHouseEdge',
          type: 'uint256',
        },
        {
          name: 'defaultPoolFee',
          type: 'uint256',
        },
        {
          name: 'jackpotPayoutToUserBps',
          type: 'uint256',
        },
        {
          name: 'jackpotPayoutToCreatorBps',
          type: 'uint256',
        },
        {
          name: 'jackpotPayoutToPoolBps',
          type: 'uint256',
        },
        {
          name: 'jackpotPayoutToWinbaBps',
          type: 'uint256',
        },
        {
          name: 'bonusToJackpotRatioBps',
          type: 'uint256',
        },
        {
          name: 'maxPayoutBps',
          type: 'uint256',
        },
        {
          name: 'poolWithdrawFeeBps',
          type: 'uint256',
        },
        {
          name: 'poolCreationAllowed',
          type: 'bool',
        },
        {
          name: 'poolDepositAllowed',
          type: 'bool',
        },
        {
          name: 'poolWithdrawAllowed',
          type: 'bool',
        },
        {
          name: 'playingAllowed',
          type: 'bool',
        },
        {
          name: 'distributionRecipient',
          type: 'address',
        },
      ],
    },
    {
      name: 'poolInitialize',
      accounts: [
        {
          name: 'initializer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'winbaState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'underlyingTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'poolUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'poolBonusUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'poolJackpotTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'winbaStateAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'lpMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'lpMintMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bonusMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bonusMintMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenMetadataProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'poolAuthority',
          type: 'address',
        },
        {
          name: 'lookupAddress',
          type: 'address',
        },
      ],
    },
    {
      name: 'poolDeposit',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'winbaState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'poolUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'lpMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'underlyingTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'userUnderlyingAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userLpAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'uint256',
        },
      ],
    },
    {
      name: 'poolWithdraw',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'poolUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'lpMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'underlyingTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'userUnderlyingAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userLpAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'winbaState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'uint256',
        },
      ],
    },
    {
      name: 'poolMintBonusTokens',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pool',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'winbaState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'underlyingTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'poolBonusUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bonusMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bonusMintMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'poolJackpotTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userUnderlyingAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userBonusAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
