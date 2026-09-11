import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BackHandler, Platform } from 'react-native'

export type Route = {
  name: string
  params?: Record<string, any>
}

type RouterContextType = {
  currentRoute: Route
  history: Route[]
  push: (name: string, params?: Record<string, any>) => void
  back: () => void
  replace: (name: string, params?: Record<string, any>) => void
  getParam: (key: string) => any
}

const RouterContext = createContext<RouterContextType | null>(null)

// The current route is mirrored into the URL hash (via replaceState, so it
// doesn't add real browser history entries) purely so a page refresh lands
// back where the user was instead of always resetting to Home.
function encodeRouteHash(route: Route): string {
  try {
    return '#' + encodeURIComponent(JSON.stringify(route))
  } catch {
    return ''
  }
}

function decodeRouteFromHash(): Route | null {
  try {
    const raw = window.location.hash.slice(1)
    if (!raw) return null
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (parsed && typeof parsed.name === 'string') return parsed as Route
    return null
  } catch {
    return null
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Route[]>(() => {
    const restored = decodeRouteFromHash()
    return [restored || { name: 'Home' }]
  })

  const currentRoute = history[history.length - 1]

  useEffect(() => {
    // No browser history on native — the hash mirror is web-only (page-refresh recovery).
    if (typeof window === 'undefined' || !window.history) return
    const hash = encodeRouteHash(currentRoute)
    if (hash && window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
  }, [currentRoute])

  const push = (name: string, params?: Record<string, any>) => {
    setHistory(prev => [...prev, { name, params }])
  }

  const back = () => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  const replace = (name: string, params?: Record<string, any>) => {
    setHistory(prev => [...prev.slice(0, -1), { name, params }])
  }

  const getParam = (key: string) => currentRoute.params?.[key]

  useEffect(() => {
    // There's no native navigation stack backing this router (screens are
    // just JS state, see AppContent) - without this, Android's hardware
    // back button has nothing to intercept it and falls through to the OS
    // default, which exits the app instead of going back a screen.
    if (Platform.OS === 'web') return
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (history.length > 1) {
        setHistory(prev => prev.slice(0, -1))
        return true
      }
      // At the root screen - let the OS handle it (exit/minimize), the
      // normal Android expectation.
      return false
    })
    return () => subscription.remove()
  }, [history])

  return (
    <RouterContext.Provider value={{ currentRoute, history, push, back, replace, getParam }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}

type LinkProps = {
  href: string
  params?: Record<string, any>
  children: ReactNode
}

export function Link({ href, params, children }: LinkProps) {
  const { push } = useRouter()
  return (
    <React.Fragment>
      {React.cloneElement(children as React.ReactElement<any>, {
        onPress: () => push(href, params),
      })}
    </React.Fragment>
  )
}
