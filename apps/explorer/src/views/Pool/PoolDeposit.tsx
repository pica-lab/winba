import { Button, Card, Dialog, Flex, Grid, Heading, IconButton, Text, TextField } from "@radix-ui/themes"
import { PublicKey } from "@solana/web3.js"
import { decodeAta, getWinbaStateAddress, getUserWusdcAccount, isNativeMint, wrapUSDC } from "winba-core"
import { useAccount, useWinbaProgram, useWinbaProvider, useSendTransaction, useWalletAddress } from "winba-react"
import BigDecimal from 'js-big-decimal'
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import useSWR, { mutate } from "swr"
import { Spinner } from "@/components/Spinner"
import { useBalance, useToast } from "@/hooks"
import { UiPool, fetchPool } from "@/views/Dashboard/PoolList"
import { TokenValue2 } from "@/components/TokenValue2"
import { useTokenMeta } from "@/hooks/useTokenMeta"
import { useWallet } from "@thirdweb-dev/react"
import { ConnectUserCard } from "../Debug/DebugUser"
import { PoolHeader } from "./PoolHeader"

export const stringtoBigIntUnits = (s: string, decimals: number) => {
  try {
    const ints = new BigDecimal(s).multiply(new BigDecimal(10 ** decimals)).round().getValue()
    return BigInt(ints)
  } catch {
    return BigInt(0)
  }
}

export function PoolDeposit({ pool }: { pool: UiPool }) {
  const navigate = useNavigate()
  const winba = useWinbaProvider()
  const user = useWalletAddress()
  const [loading, setLoading] = React.useState(false)
  const [amountText, setAmountText] = React.useState("")
  const token = useTokenMeta(pool.state.underlyingTokenMint)
  const balance = useBalance(pool.state.underlyingTokenMint)
  const sendTransaction = useSendTransaction()
  const toast = useToast()

  const deposit = async () => {
    try {
      setLoading(true)
      const amount = stringtoBigIntUnits(amountText, token.decimals)
      await sendTransaction(
        winba.depositIntoPool(pool.publicKey, pool.state.underlyingTokenMint, amount),
        { confirmation: "confirmed" }
      )
      toast({ title: "Deposit Successful", description: `You deposited ${amountText} ${token.symbol}.` })
      mutate("pool-" + pool.publicKey.toBase58())
    } catch (error) {
      toast({ title: "Deposit Failed", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid gap="2">
      <Heading>Deposit {token.name}</Heading>
      <TextField.Root>
        <TextField.Input
          placeholder="Amount"
          value={amountText}
          size="3"
          onChange={(event) => setAmountText(event.target.value)}
        />
        <TextField.Slot>
          <IconButton onClick={() => setAmountText(String(balance.balance / (10 ** token.decimals)))} size="1" variant="ghost">
            MAX
          </IconButton>
        </TextField.Slot>
      </TextField.Root>
      <Flex justify="between">
        <Text size="2" color="gray">Balance</Text>
        <Text size="2">
          <TokenValue2 exact amount={balance.balance} mint={pool.underlyingTokenMint} />
        </Text>
      </Flex>
      <Button size="3" variant="soft" onClick={deposit} disabled={loading}>
        Deposit {loading && <Spinner $small />}
      </Button>
    </Grid>
  )
}

export default function PoolDepositView() {
  const program = useWinbaProgram()
  const params = useParams<{ poolId: string }>()
  const poolId = React.useMemo(() => new PublicKey(params.poolId!), [params.poolId])
  const { data } = useSWR("pool-" + params.poolId!, () => fetchPool(program.provider.connection, poolId))
  const wallet = useWallet()

  return (
    <>
      {data && (
        <Grid gap="4">
          <Flex justify="between" align="end" py="4">
            <PoolHeader pool={data} />
          </Flex>
          {wallet.address ? (
            <Card size="3">
              <PoolDeposit pool={data} />
            </Card>
          ) : (
            <ConnectUserCard />
          )}
        </Grid>
      )}
    </>
  )
}
