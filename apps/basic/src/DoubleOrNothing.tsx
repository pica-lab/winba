import { GameResult, solToLamports } from 'gamba'
import { useGamba, useGambaError } from 'gamba/react'
import { formatLamports } from 'gamba/react-ui'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const getToast = (result: GameResult) => {
  if (result.payout > 0) {
    return <span>You won <b>{formatLamports(result.payout)}</b></span>
  }
  return <span>You lost</span>
}

export default function DoubleOrNothing() {
  const [status, setStatus] = useState('none')
  const gamba = useGamba()

  useGambaError(
    (err) => {
      toast(err.message, { type: 'error' })
    },
  )

  const play = async () => {
    try {
      //
      setStatus('requested')

      // Wager 0.05 SOL
      const wager = solToLamports(0.05)

      // Initiate the request
      const req = await gamba.play({
        bet: [2, 0],
        wager,
      })

      setStatus('flipping')

      const result = await req.result()

      const win = result.payout > 0

      // Show a notification
      toast(getToast(result), {
        isLoading: false,
        draggable: true,
        autoClose: 5000,
        icon: win ? '🎉' : '💀',
      })
    } catch (err) {
      console.error(err)
    } finally {
      setStatus('none')
    }
  }

  return (
    <button className="play" onClick={play}>
      {status}
    </button>
  )
}
