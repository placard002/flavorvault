import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('folio_token')
      const storedUser = localStorage.getItem('folio_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      localStorage.removeItem('folio_token')
      localStorage.removeItem('folio_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback((data) => {
    const { token: tok, ...userData } = data
    setToken(tok)
    setUser(userData)
    localStorage.setItem('folio_token', tok)
    localStorage.setItem('folio_user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('folio_token')
    localStorage.removeItem('folio_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
