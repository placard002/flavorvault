import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Compass, LogOut, Menu, X, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--color-amber)' : 'var(--color-muted)',
    fontWeight: isActive ? 600 : 500,
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color 0.15s'
  })

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(250,248,245,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1.5px solid var(--color-border)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline" onClick={() => setMobileOpen(false)}>
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 900,
                fontSize: '24px',
                color: 'var(--color-text)',
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}
            >
              Folio
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--color-amber)', marginTop: '2px' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/explore" style={navLinkStyle}>
              <Compass size={16} />
              Explore
            </NavLink>
            <NavLink to="/favorites" style={navLinkStyle}>
              <Heart size={16} />
              Favorites
            </NavLink>
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'var(--color-amber-light)', color: 'var(--color-amber)' }}
                >
                  <User size={13} />
                  <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                    {user.name?.split(' ')[0] || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{ color: 'var(--color-muted)', border: '1.5px solid var(--color-border)', background: 'transparent' }}
                  aria-label="Log out"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    background: 'var(--color-amber)',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg"
            style={{ border: '1.5px solid var(--color-border)', background: '#fff' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-16 z-40"
          style={{
            background: 'rgba(250,248,245,0.98)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1.5px solid var(--color-border)',
            boxShadow: '0 8px 24px rgba(28,20,16,0.08)'
          }}
        >
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            <NavLink
              to="/explore"
              style={navLinkStyle}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-3 rounded-xl"
            >
              <Compass size={18} />
              Explore Recipes
            </NavLink>
            <NavLink
              to="/favorites"
              style={navLinkStyle}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-3 rounded-xl"
            >
              <Heart size={18} />
              My Favorites
            </NavLink>
            <div style={{ height: '1px', background: 'var(--color-border)', margin: '8px 0' }} />
            {user ? (
              <>
                <div className="px-3 py-2 flex items-center gap-2">
                  <User size={16} style={{ color: 'var(--color-amber)' }} />
                  <span style={{ fontSize: '14px', color: 'var(--color-text)', fontWeight: 500 }}>
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-3 text-left flex items-center gap-2 rounded-xl text-sm font-medium"
                  style={{ color: 'var(--color-muted)' }}
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="mx-3 my-2 py-3 rounded-xl text-center text-sm font-semibold"
                style={{ background: 'var(--color-amber)', color: '#fff', textDecoration: 'none', display: 'block' }}
              >
                Sign In / Register
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Mobile menu backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}
