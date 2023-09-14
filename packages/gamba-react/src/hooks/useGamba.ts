import { GambaError, GambaError2, GambaPlayParams } from 'gamba-core'
import React from 'react'
import { GambaContext } from '../GambaProvider'
import { randomSeed } from '../utils'
import { useBalances } from './useBalances'
import { useGambaClient } from './useGambaClient'

/**
 * Catch Gamba method call errors and resolve them in order to automatically re-execute them.
 */
export function useGambaError(callback: (err: GambaError2) => void) {
  const client = useGambaClient()
  React.useEffect(() => client.onError(callback), [callback])
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function useGamba() {
  const { creator, seed, setSeed } = React.useContext(GambaContext)
  const client = useGambaClient()
  const balances = useBalances()

  const { connection, wallet, state, anticipate, closeAccount, initializeAccount, withdraw, redeemBonusToken } = client

  const updateSeed = (seed = randomSeed()) => setSeed(seed)

  const play = async (params: Optional<GambaPlayParams, 'creator' | 'seed'>) => {
    const res = await client.play({
      seed,
      creator,
      ...params,
    })
    return { ...res, result: nextResult }
  }

  /**
   * Waits for the user nonce to advance, and then derives a result
   * @returns GameResult
   */
  const nextResult = async () => {
    return await client.anticipate(
      (state, previous) => {
        if (!state.user.created) {
          throw new Error(GambaError.USER_ACCOUNT_CLOSED_BEFORE_RESULT)
        }
        if (state.user.nonce > previous.user.nonce + 1) {
          throw new Error(GambaError.FAILED_TO_GENERATE_RESULT)
        }
        if (state.user.lastGame && state.user.nonce === previous.user.nonce + 1) {
          return state.user.lastGame
        }
      },
    )
  }

  return {
    connection,
    wallet,
    seed,
    updateSeed,
    balances,
    house: state.house,
    user: state.user,
    owner: state.wallet,
    anticipate: anticipate.bind(client),
    redeemBonusToken,
    play,
    closeAccount,
    initializeAccount,
    withdraw,
    nextResult,
  }
}
