import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import RecipeCard from '../components/RecipeCard.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { recipesAPI } from '../api/client.js'

function RecipeSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--color-border)' }}>
      <div className="skeleton" style={{ paddingTop: '75%' }} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex gap-3 mt-1">
          <div className="skeleton h-3 w-12" />
          <div className="skeleton h-3 w-8" />
          <div className="skeleton h-3 w-14" />
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Derive state from URL params
  const searchQuery = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const cuisine = searchParams.get('cuisine') || ''
  const ingredient = searchParams.get('ingredient') || ''

  const [localSearch, setLocalSearch] = useState(searchQuery)
  const debounceRef = useRef(null)
  const abortRef = useRef(null)

  const filters = { search: searchQuery, category, cuisine, ingredient }

  const fetchRecipes = useCallback(async (params) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort()

    setLoading(true)
    setError(null)

    try {
      const result = await recipesAPI.list(params)
      setRecipes(result.data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to load recipes. Please try again.')
        console.error('Fetch recipes error:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch when URL params change
  useEffect(() => {
    fetchRecipes({ search: searchQuery, category, cuisine, ingredient })
  }, [searchQuery, category, cuisine, ingredient, fetchRecipes])

  // Sync local search input with URL param
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  function updateParams(updates) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v)
        else next.delete(k)
      })
      return next
    }, { replace: true })
  }

  function handleSearchChange(e) {
    const val = e.target.value
    setLocalSearch(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParams({ search: val.trim() })
    }, 400)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    clearTimeout(debounceRef.current)
    updateParams({ search: localSearch.trim() })
  }

  function handleFilterChange(updates) {
    updateParams(updates)
  }

  function handleFavoriteChange(id, newState) {
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, isFavorited: newState } : r)
    )
  }

  const totalCount = recipes.length
  const hasFilters = searchQuery || category || cuisine || ingredient

  return (
    <div className="page-enter min-h-screen">
      {/* ── SEARCH HEADER ── */}
      <div
        className="py-10 px-4"
        style={{
          background: 'linear-gradient(180deg, var(--color-amber-light) 0%, var(--color-bg) 100%)',
          borderBottom: '1.5px solid var(--color-border)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 40px)',
              color: 'var(--color-text)',
              marginBottom: '20px'
            }}
          >
            Explore recipes
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit}>
            <div className="relative" style={{ maxWidth: '600px' }}>
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-muted)' }}
              />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Search by recipe name, ingredient, or cuisine…"
                className="w-full pl-12 pr-12 py-4 rounded-xl text-base"
                style={{
                  border: '1.5px solid var(--color-border)',
                  background: '#fff',
                  color: 'var(--color-text)',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  boxShadow: '0 2px 8px rgba(28,20,16,0.06)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-amber)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                autoFocus
              />
              {localSearch && (
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => { setLocalSearch(''); updateParams({ search: '' }) }}
                  aria-label="Clear search"
                >
                  <X size={16} style={{ color: 'var(--color-muted)' }} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── FILTERS + RESULTS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FilterBar filters={{ category, cuisine, ingredient }} onChange={handleFilterChange} />

        {/* Results header */}
        <div className="flex items-center justify-between py-5">
          <p style={{ color: 'var(--color-muted)', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
            {loading
              ? 'Loading…'
              : `${totalCount} recipe${totalCount !== 1 ? 's' : ''} found${hasFilters ? ' for your filters' : ''}`
            }
          </p>
          {hasFilters && !loading && (
            <div className="flex items-center gap-2 flex-wrap">
              {category && (
                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'var(--color-amber-light)', color: 'var(--color-amber)', border: '1px solid var(--color-amber)' }}
                >
                  {category}
                  <button onClick={() => updateParams({ category: '' })} aria-label="Remove category filter">
                    <X size={10} />
                  </button>
                </span>
              )}
              {cuisine && (
                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'var(--color-sage-light)', color: 'var(--color-sage)', border: '1px solid var(--color-sage)' }}
                >
                  {cuisine}
                  <button onClick={() => updateParams({ cuisine: '' })} aria-label="Remove cuisine filter">
                    <X size={10} />
                  </button>
                </span>
              )}
              {ingredient && (
                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'var(--color-rose-light)', color: '#C4785A', border: '1px solid var(--color-rose)' }}
                >
                  {ingredient}
                  <button onClick={() => updateParams({ ingredient: '' })} aria-label="Remove ingredient filter">
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {error ? (
          <div className="text-center py-16">
            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl mb-4"
              style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}
            >
              <span style={{ color: '#DC2626', fontSize: '14px' }}>{error}</span>
            </div>
            <br />
            <button
              onClick={() => fetchRecipes(filters)}
              className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-amber)', color: '#fff', border: 'none' }}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <RecipeSkeleton key={i} />)
              : recipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onFavoriteChange={handleFavoriteChange}
                  />
                ))
            }
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6 mx-auto" style={{ width: '80px', height: '80px' }}>
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="var(--color-amber-light)" />
                <path d="M40 24C31.163 24 24 31.163 24 40C24 48.837 31.163 56 40 56C48.837 56 56 48.837 56 40C56 31.163 48.837 24 40 24Z" fill="var(--color-border)" />
                <path d="M34 38C34 36.895 34.895 36 36 36H44C45.105 36 46 36.895 46 38V46H34V38Z" fill="var(--color-amber)" opacity="0.4" />
                <circle cx="40" cy="34" r="3" fill="var(--color-amber)" opacity="0.6" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '22px',
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: '8px'
              }}
            >
              No recipes found
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Try adjusting your search or filters to discover more recipes.
            </p>
            <button
              onClick={() => {
                setLocalSearch('')
                setSearchParams({})
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--color-amber)', color: '#fff', border: 'none' }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
