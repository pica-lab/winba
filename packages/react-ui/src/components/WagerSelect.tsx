import { useWinba } from 'winba-react'
import React from 'react'
import { Select } from './Select'
import { TokenValue } from './TokenValue'

export interface WagerSelectProps {
  options: number[]
  value: number
  onChange: (value: number) => void
  className?: string
}

/**
 * @deprecated Use WagerInput with "options" prop
 */
export function WagerSelect(props: WagerSelectProps) {
  const winba = useWinba()
  return (
    <Select
      className={props.className}
      options={props.options}
      value={props.value}
      onChange={props.onChange}
      disabled={winba.isPlaying}
      label={(value) => (
        <TokenValue amount={value} />
      )}
    />
  )
}
