import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { setAccessToken } from '../api/client'
import type { UserSummary } from '../api/types'

type AuthState = {
  user: UserSummary | null
  isAuthenticated: boolean
  login: (user: UserSummary, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateUser: (user: UserSummary) => void
}

const AuthContext = createContext<AuthState | null>(null)

// Mock user for demo — when API is connected, this starts as null
const MOCK_USER: UserSummary = {
  id: 1,
  email: 'rahul.mehta@gmail.com',
  fullName: 'Rahul Mehta',
  role: 'CUSTOMER',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(MOCK_USER)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const login = useCallback((u: UserSummary, access: string, refresh: string) => {
    setUser(u)
    setAccessToken(access)
    setRefreshToken(refresh)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
  }, [])

  const updateUser = useCallback((u: UserSummary) => {
    setUser(u)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
