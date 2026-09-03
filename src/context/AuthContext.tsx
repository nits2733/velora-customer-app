import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { setAccessToken, setRefreshToken, setSessionExpiredHandler } from '../api/client'
import { authApi } from '../api/auth'
import { userApi } from '../api/user'
import type { UserSummary } from '../api/types'

const REFRESH_TOKEN_KEY = 'velora_refresh_token'

type AuthState = {
  user: UserSummary | null
  avatarUrl: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (user: UserSummary, accessToken: string, refreshToken: string) => void
  logout: () => Promise<void>
  updateUser: (user: UserSummary) => void
  updateAvatar: (avatarUrl: string | null) => void
}

const AuthContext = createContext<AuthState | null>(null)

function readStoredRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

function persistRefreshToken(token: string | null) {
  try {
    if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token)
    else localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    // localStorage unavailable (private mode, etc.) — session just won't persist across reloads.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [refreshTokenState, setRefreshTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // UserSummary (from login/refresh) has no avatarUrl — fetch the full
  // profile once so the header/menu avatars can show the real photo too.
  const fetchAvatar = useCallback(() => {
    userApi.getProfile()
      .then(p => setAvatarUrl(p.avatarUrl || null))
      .catch(() => {})
  }, [])

  const login = useCallback((u: UserSummary, access: string, refresh: string) => {
    setUser(u)
    setRefreshTokenState(refresh)
    setAccessToken(access)
    setRefreshToken(refresh)
    persistRefreshToken(refresh)
    fetchAvatar()
  }, [fetchAvatar])

  const clearSession = useCallback(() => {
    setUser(null)
    setAvatarUrl(null)
    setRefreshTokenState(null)
    setAccessToken(null)
    setRefreshToken(null)
    persistRefreshToken(null)
  }, [])

  const logout = useCallback(async () => {
    const refresh = refreshTokenState
    clearSession()
    if (refresh) {
      try {
        await authApi.logout({ refreshToken: refresh })
      } catch {
        // Logout is best-effort — an already-expired token still ends the local session.
      }
    }
  }, [refreshTokenState, clearSession])

  const updateUser = useCallback((u: UserSummary) => {
    setUser(u)
  }, [])

  const updateAvatar = useCallback((url: string | null) => {
    setAvatarUrl(url)
  }, [])

  // Restore a session on boot from the persisted refresh token (the access
  // token is never persisted — it lives in memory only, per client.ts).
  useEffect(() => {
    setSessionExpiredHandler(clearSession)

    const stored = readStoredRefreshToken()
    if (!stored) {
      setLoading(false)
      return
    }

    authApi.refresh({ refreshToken: stored })
      .then(res => {
        setUser(res.user)
        setRefreshTokenState(res.refreshToken)
        setAccessToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        persistRefreshToken(res.refreshToken)
        fetchAvatar()
      })
      .catch(() => {
        persistRefreshToken(null)
      })
      .finally(() => setLoading(false))

    return () => setSessionExpiredHandler(null)
  }, [clearSession, fetchAvatar])

  return (
    <AuthContext.Provider value={{ user, avatarUrl, isAuthenticated: !!user, loading, login, logout, updateUser, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
