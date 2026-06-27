import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import RecipeCard from '../components/RecipeCard.jsx'
import { recipesAPI } from '../api/client.js'

const CATEGORIES = [
  {
    name: 'Baking',
    tagline: 'Artisan breads, flaky pastries & morning buns',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    color: '#D4830A',
    textColor: '#fff'
  },
  {
    name: 'Cooking',
    tagline: 'Weeknight dinners to weekend feasts',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    color: '#7A9E7E',
    textColor: '#fff'
  },
  {
    name: 'Desserts',
    tagline: 'Sweet endings worth saving room for',
    image: 'https://images.unsplash.com/photo-1488477181228-c84def11de88?w=800&q=80',
    color: '#E8B4A0',
    textColor: '#1C1410'
  }
]

function RecipeSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--color-border)' }}>
      <div className="skeleton" style={{ paddingTop: '75%' }} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    recipesAPI.list()
      .then(r => setFeatured(r.data.slice(0, 6)))
      .catch(err => console.error('Failed to load featured recipes:', err))
      .finally(() => setLoading(false))
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section
        className="hero-gradient relative overflow-hidden"
        style={{ minHeight: 'min(580px, 90vw)' }}
      >
        {/* Background texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(212,131,10,0.2)', border: '1px solid rgba(212,131,10,0.3)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-amber)' }} />
              <span style={{ color: 'var(--color-amber)', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                A recipe for every moment
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 900,
                fontSize: 'clamp(42px, 6vw, 72px)',
                color: '#FAF8F5',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                marginBottom: '20px'
              }}
            >
              Recipes that<br />
              <em style={{ color: 'var(--color-amber)', fontStyle: 'italic' }}>tell a story.</em>
            </h1>
            <p
              style={{
                color: 'rgba(250,248,245,0.7)',
                fontSize: '17px',
                lineHeight: 1.7,
                marginBottom: '36px',
                fontFamily: 'Inter, sans-serif',
                maxWidth: '480px'
              }}
            >
              Discover handcrafted recipes for baking, cooking, and desserts — curated with care for every skill level and appetite.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div
                className="flex-1 relative"
                style={{ maxWidth: '420px' }}
              >
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(28,20,16,0.4)' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search recipes, ingredients…"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm"
                  style={{
                    background: '#FAF8F5',
                    color: 'var(--color-text)',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                style={{
                  background: 'var(--color-amber)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 12px rgba(212,131,10,0.4)'
                }}
              >
                Explore
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48L1440 48L1440 16C1320 38 1200 48 1080 44C960 40 840 20 720 16C600 12 480 20 360 28C240 36 120 44 0 40L0 48Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 700,
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: 'var(--color-text)'
            }}
          >
            Browse by category
          </h2>
          <Link
            to="/explore"
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: 'var(--color-amber)', textDecoration: 'none' }}
          >
            All recipes <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/explore?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl block"
              style={{ textDecoration: 'none', minHeight: '200px' }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${cat.color}E6 0%, ${cat.color}99 40%, transparent 70%)`
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h3
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontWeight: 700,
                    fontSize: '22px',
                    color: cat.textColor,
                    marginBottom: '4px',
                    lineHeight: 1.1
                  }}
                >
                  {cat.name}
                </h3>
                <p style={{ color: cat.textColor, fontSize: '13px', opacity: 0.85, fontFamily: 'Inter, sans-serif' }}>
                  {cat.tagline}
                </p>
              </div>
              {/* Hover arrow */}
              <div
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(250,248,245,0.9)' }}
              >
                <ArrowRight size={14} style={{ color: cat.color === '#E8B4A0' ? 'var(--color-text)' : cat.color }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED RECIPES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 3vw, 32px)',
                color: 'var(--color-text)',
                marginBottom: '4px'
              }}
            >
              Featured recipes
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              Handpicked for you this week
            </p>
          </div>
          <Link
            to="/explore"
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: 'var(--color-amber)', textDecoration: 'none' }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <RecipeSkeleton key={i} />)
            : featured.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
          }
        </div>

        {!loading && featured.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: 'var(--color-muted)', fontFamily: 'Fraunces, serif', fontSize: '20px' }}>
              No recipes found yet.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--color-amber)', color: '#fff', textDecoration: 'none' }}
            >
              Explore recipes <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* ── EDITORIAL BANNER ── */}
      <section
        className="py-16 px-4"
        style={{ background: 'var(--color-amber-light)', borderTop: '1.5px solid var(--color-border)', borderBottom: '1.5px solid var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 700,
                fontSize: 'clamp(22px, 3vw, 30px)',
                color: 'var(--color-text)',
                marginBottom: '8px'
              }}
            >
              Save your favourites.
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px', fontFamily: 'Inter, sans-serif', maxWidth: '400px' }}>
              Create a free account to heart recipes, build your personal cookbook, and never lose a great dish again.
            </p>
          </div>
          <Link
            to="/auth"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm flex-shrink-0"
            style={{ background: 'var(--color-amber)', color: '#fff', textDecoration: 'none', boxShadow: '0 2px 8px rgba(212,131,10,0.3)' }}
          >
            Get started free <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}
