import React, { useEffect, useState } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { metaAPI } from '../api/client.js'

export default function FilterBar({ filters, onChange }) {
  const [categories, setCategories] = useState(['Baking', 'Cooking', 'Desserts'])
  const [cuisines, setCuisines] = useState([])
  const [cuisineOpen, setCuisineOpen] = useState(false)
  const [ingredientInput, setIngredientInput] = useState(filters.ingredient || '')

  useEffect(() => {
    metaAPI.categories()
      .then(r => setCategories(r.data))
      .catch(() => {})
    metaAPI.cuisines()
      .then(r => setCuisines(r.data))
      .catch(() => {})
  }, [])

  // Sync external ingredient filter
  useEffect(() => {
    setIngredientInput(filters.ingredient || '')
  }, [filters.ingredient])

  function handleCategoryClick(cat) {
    onChange({ category: filters.category === cat ? '' : cat })
  }

  function handleCuisineSelect(cuisine) {
    onChange({ cuisine: filters.cuisine === cuisine ? '' : cuisine })
    setCuisineOpen(false)
  }

  function handleIngredientSubmit(e) {
    e.preventDefault()
    onChange({ ingredient: ingredientInput.trim() })
  }

  function clearAll() {
    setIngredientInput('')
    onChange({ category: '', cuisine: '', ingredient: '' })
  }

  const hasFilters = filters.category || filters.cuisine || filters.ingredient

  return (
    <div
      className="py-4 px-0"
      style={{ borderBottom: '1.5px solid var(--color-border)' }}
    >
      {/* Category chips */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span style={{ color: 'var(--color-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
          Category
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-medium ${filters.category === cat ? 'filter-chip-active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cuisine + ingredient row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Cuisine dropdown */}
        <div className="relative">
          <button
            onClick={() => setCuisineOpen(!cuisineOpen)}
            className={`filter-chip flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${filters.cuisine ? 'filter-chip-active' : ''}`}
          >
            <span>{filters.cuisine || 'Cuisine'}</span>
            <ChevronDown size={14} style={{ transform: cuisineOpen ? 'rotate(180deg)' : '', transition: 'transform 0.15s' }} />
          </button>
          {cuisineOpen && (
            <div
              className="absolute left-0 top-full mt-1 bg-white rounded-xl py-1 z-50"
              style={{
                border: '1.5px solid var(--color-border)',
                boxShadow: '0 8px 24px rgba(28,20,16,0.12)',
                minWidth: '160px',
                maxHeight: '240px',
                overflowY: 'auto'
              }}
            >
              {filters.cuisine && (
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#FAF8F5]"
                  style={{ color: 'var(--color-amber)' }}
                  onClick={() => { onChange({ cuisine: '' }); setCuisineOpen(false) }}
                >
                  Clear selection
                </button>
              )}
              {cuisines.map(c => (
                <button
                  key={c}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#FAF8F5]"
                  style={{
                    color: filters.cuisine === c ? 'var(--color-amber)' : 'var(--color-text)',
                    fontWeight: filters.cuisine === c ? 600 : 400
                  }}
                  onClick={() => handleCuisineSelect(c)}
                >
                  {c}
                </button>
              ))}
              {cuisines.length === 0 && (
                <p className="px-4 py-2 text-sm" style={{ color: 'var(--color-muted)' }}>Loading…</p>
              )}
            </div>
          )}
        </div>

        {/* Ingredient search */}
        <form onSubmit={handleIngredientSubmit} className="flex-1" style={{ maxWidth: '280px' }}>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-muted)' }}
            />
            <input
              type="text"
              value={ingredientInput}
              onChange={e => setIngredientInput(e.target.value)}
              placeholder="Search by ingredient…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
              style={{
                border: '1.5px solid var(--color-border)',
                background: '#fff',
                color: 'var(--color-text)',
                outline: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-amber)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            {ingredientInput && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => { setIngredientInput(''); onChange({ ingredient: '' }) }}
              >
                <X size={12} style={{ color: 'var(--color-muted)' }} />
              </button>
            )}
          </div>
        </form>

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: 'var(--color-muted)' }}
          >
            <X size={13} />
            Clear filters
          </button>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {cuisineOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setCuisineOpen(false)} />
      )}
    </div>
  )
}
