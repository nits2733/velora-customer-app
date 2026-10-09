import React, { useEffect, useMemo, useRef } from 'react'
import { colors } from '../theme/tokens'
import { buildLocationMapHtml, MapPlace, MapSelection } from './locationMapHtml'

type Props = {
  places: MapPlace[]
  focus?: { lat: number; lng: number } | null
  onSelect: (selection: MapSelection) => void
  height?: number
}

export default function LocationMap({ places, focus, onSelect, height = 320 }: Props) {
  const ref = useRef<HTMLIFrameElement>(null)
  const html = useMemo(() => buildLocationMapHtml(places, colors.accent), [places])

  useEffect(() => {
    const win = ref.current?.contentWindow as (Window & { __focus?: (lat: number, lng: number) => void }) | null
    if (focus) win?.__focus?.(focus.lat, focus.lng)
  }, [focus])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow || typeof e.data !== 'string') return
      try {
        const sel = JSON.parse(e.data)
        if (typeof sel?.name === 'string') onSelect(sel)
      } catch {
        // ignore non-selection messages
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onSelect])

  return (
    <iframe
      ref={ref}
      title="Location map"
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      style={{ width: '100%', height, border: 0, borderRadius: 12 }}
    />
  )
}
