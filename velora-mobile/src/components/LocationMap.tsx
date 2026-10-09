import React, { useEffect, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { colors } from '../theme/tokens'
import { buildLocationMapHtml, MapPlace, MapSelection } from './locationMapHtml'

type Props = {
  places: MapPlace[]
  focus?: { lat: number; lng: number } | null
  onSelect: (selection: MapSelection) => void
  height?: number
}

export default function LocationMap({ places, focus, onSelect, height = 320 }: Props) {
  const ref = useRef<WebView>(null)
  const html = useMemo(() => buildLocationMapHtml(places, colors.accent), [places])

  useEffect(() => {
    if (focus) ref.current?.injectJavaScript(`window.__focus(${focus.lat}, ${focus.lng}); true;`)
  }, [focus])

  const handleMessage = (e: WebViewMessageEvent) => {
    try {
      const sel = JSON.parse(e.nativeEvent.data)
      if (typeof sel?.name === 'string') onSelect(sel)
    } catch {
      // ignore non-selection messages
    }
  }

  return (
    <View style={[styles.wrap, { height }]}>
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 12, overflow: 'hidden', backgroundColor: colors.border },
})
