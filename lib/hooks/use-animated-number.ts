'use client'

import { useEffect, useRef, useState } from 'react'

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

type Opts = {
  duration?: number
  decimals?: number
  easing?: (t: number) => number
}

export function useAnimatedNumber(
  value: number,
  { duration = 600, decimals = 0, easing = easeInOut }: Opts = {}
): number {
  const [displayed, setDisplayed] = useState(value)
  const fromRef = useRef(value)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return

    startRef.current = null
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(1, elapsed / duration)
      const easedT = easing(t)
      const current = from + (to - from) * easedT

      const factor = Math.pow(10, decimals)
      setDisplayed(Math.round(current * factor) / factor)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration, decimals, easing])

  return displayed
}
