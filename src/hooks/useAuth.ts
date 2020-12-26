import { AuthUser } from '@server/lib/auth'
import React from 'react'

const AuthContext = React.createContext<AuthUser | null>(null)

export const AuthProvider = AuthContext.Provider

export const useAuth = () => {
  const user = React.useContext(AuthContext)
  return { user }
}
