import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Clock, Users, ChefHat, ArrowLeft, BookOpen, Flame } from 'lucide-react'
import StepTimeline from '../components/StepTimeline.jsx'
import { CategoryBadge } from '../components/Badge.jsx'
import { recipesAPI, favoritesAPI } from '../api/client.js'
import { useAuth } from '../contexts/AuthContext.jsx'

function MetaItem({ icon: Icon, label, value, color }) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl"
      style={{ background: '#fff', border: '1.5px solid var(--color-border)', minWidth: '80px' }}
    >
      <Icon size={16} style={{ color: color || 'var(--color-amber)' }} />
      <span style={{ fontSize: '18px', fontFamily: 'Fraunces, serif', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  )
}

const DIFFICULTY_COLORS = { Easy: '#7A9E7E', Medium: '#D4830A', Hard: '#C0392B' }

export default function RecipePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorited, setFavorited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(true)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    recipesAPI.get(id)
      .then(r => {
        setRecipe(r.data)
        setFavorited(r.data.isFavorited || false)
      })
      .catch(err => {
        if (err.code === 'NOT_FOUND' || err.status === 404) {
          setError('notfound')
        } else {
          setError('error')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleFavorite() {
    if (!user) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 3000)
      return
    }
    if (favLoading) return
    setFavLoading(true)
    const newState = !favorited
    setFavorited(newState)
    try {
      if (newState) await favoritesAPI.add(id)
      else await favoritesAPI.remove(id)
    } catch {
      setFavorited(!newState)
    } finally {
      setFavLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="skeleton h-8 w-32 mb-6 rounded-lg" />
        <div className="skeleton rounded-2xl mb-8" style={{ height: '360px' }} />
        <div className="skeleton h-10 w-2/3 mb-4" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-4/5" />
      </div>
    )
  }

  if (error === 'notfound') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center page-enter">
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🥣</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
          Recipe not found
        </h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>This recipe may have been removed or never existed.</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--color-amber)', color: '#fff', textDecoration: 'none' }}
        >
          <ArrowLeft size={14} /> Browse recipes
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center page-enter">
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: 'var(--color-text)', marginBottom: '12px' }}>
          Something went wrong
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-amber)', color: '#fff', border: 'none' }}
        >
          Try again
        </button>
      </div>
    )
  }

  if (!recipe) return null

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
  const fallbackImg = {
    baking: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200',
    cooking: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    desserts: 'https://images.unsplash.com/photo-1488477181228-c84def11de88?w=1200'
  }
  const heroImg = imgError
    ? (fallbackImg[(recipe.category || '').toLowerCase()] || fallbackImg.cooking)
    : recipe.imageUrl

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(280px, 40vw, 440px)' }}>
        <img
          src={heroImg}
          alt={recipe.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.75) 0%, rgba(28,20,16,0.2) 50%, transparent 80%)' }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: 'rgba(250,248,245,0.92)',
            backdropFilter: 'blur(8px)',
            color: 'var(--color-text)',
            border: '1px solid rgba(255,255,255,0.4)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Favorite button */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button
              onClick={handleFavorite}
              aria-label={favorited ? 'Remove from favorites' : 'Save recipe'}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: favorited ? 'var(--color-rose)' : 'rgba(250,248,245,0.92)',
                backdropFilter: 'blur(8px)',
                color: favorited ? '#1C1410' : 'var(--color-text)',
                border: favorited ? 'none' : '1px solid rgba(255,255,255,0.4)',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s'
              }}
            >
              <Heart
                size={14}
                fill={favorited ? '#C4785A' : 'none'}
                stroke={favorited ? '#C4785A' : 'var(--color-text)'}
              />
              {favorited ? 'Saved' : 'Save'}
            </button>
            {showLoginPrompt && (
              <div
                className="absolute right-0 top-full mt-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap"
                style={{ background: 'var(--color-text)', color: '#FAF8F5', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 10 }}
              >
                <Link to="/auth" style={{ color: 'var(--color-amber)' }}>Sign in</Link> to save recipes
              </div>
            )}
          </div>
        </div>

        {/* Bottom-left: category + cuisine */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <CategoryBadge category={recipe.category} />
          {recipe.cuisine && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(250,248,245,0.15)', color: '#FAF8F5', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {recipe.cuisine}
            </span>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Title + description */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 900,
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'var(--color-text)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '12px'
            }}
          >
            {recipe.title}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '16px', lineHeight: 1.7, maxWidth: '680px', fontFamily: 'Inter, sans-serif' }}>
            {recipe.description}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 mb-10">
          <MetaItem icon={Clock} label="Prep" value={`${recipe.prepTime}m`} />
          <MetaItem icon={Flame} label="Cook" value={`${recipe.cookTime}m`} color="#C0392B" />
          <MetaItem icon={Clock} label="Total" value={`${totalTime}m`} color="#7A9E7E" />
          <MetaItem icon={Users} label="Serves" value={recipe.servings} color="#7A9E7E" />
          <div
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl"
            style={{ background: '#fff', border: '1.5px solid var(--color-border)', minWidth: '80px' }}
          >
            <ChefHat size={16} style={{ color: DIFFICULTY_COLORS[recipe.difficulty] || 'var(--color-amber)' }} />
            <span style={{ fontSize: '18px', fontFamily: 'Fraunces, serif', fontWeight: 700, color: DIFFICULTY_COLORS[recipe.difficulty] || 'var(--color-amber)', lineHeight: 1 }}>
              {recipe.difficulty}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Level
            </span>
          </div>
        </div>

        {/* Desktop: two-column layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* ── INGREDIENTS (sidebar on desktop, accordion on mobile) ── */}
          <div className="lg:col-span-1">
            {/* Mobile accordion */}
            <div className="lg:hidden mb-8">
              <button
                onClick={() => setAccordionOpen(!accordionOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold"
                style={{
                  background: 'var(--color-amber-light)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontFamily: 'Fraunces, serif',
                  fontSize: '18px'
                }}
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} style={{ color: 'var(--color-amber)' }} />
                  Ingredients ({recipe.ingredients?.length || 0})
                </span>
                <span style={{ transform: accordionOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s', fontSize: '20px' }}>↓</span>
              </button>
              {accordionOpen && (
                <div className="mt-2 p-4 rounded-xl" style={{ background: '#fff', border: '1.5px solid var(--color-border)' }}>
                  <IngredientList ingredients={recipe.ingredients} />
                </div>
              )}
            </div>

            {/* Desktop sticky sidebar */}
            <div
              className="hidden lg:block ingredient-sidebar p-5 rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid var(--color-border)' }}
            >
              <h2
                className="flex items-center gap-2 mb-4"
                style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '20px', color: 'var(--color-text)' }}
              >
                <BookOpen size={18} style={{ color: 'var(--color-amber)' }} />
                Ingredients
                <span
                  className="ml-auto text-sm px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--color-amber-light)', color: 'var(--color-amber)', fontFamily: 'Inter, sans-serif' }}
                >
                  {recipe.ingredients?.length || 0}
                </span>
              </h2>
              <IngredientList ingredients={recipe.ingredients} />
            </div>
          </div>

          {/* ── STEPS ── */}
          <div className="lg:col-span-2">
            <h2
              className="flex items-center gap-2 mb-6"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '24px', color: 'var(--color-text)' }}
            >
              Instructions
              <span
                className="text-sm px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--color-amber-light)', color: 'var(--color-amber)', fontFamily: 'Inter, sans-serif' }}
              >
                {recipe.steps?.length || 0} steps
              </span>
            </h2>
            <StepTimeline steps={recipe.steps} />
          </div>
        </div>
      </div>
    </div>
  )
}

function IngredientList({ ingredients }) {
  if (!ingredients || ingredients.length === 0) {
    return <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>No ingredients listed.</p>
  }
  return (
    <ul className="space-y-2">
      {ingredients.map((ing, i) => (
        <li
          key={i}
          className="flex items-start gap-3 py-2"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
            style={{ background: 'var(--color-amber)' }}
          />
          <div className="flex-1 flex items-baseline justify-between gap-2">
            <span style={{ color: 'var(--color-text)', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              {ing.name}
            </span>
            <span
              style={{
                color: 'var(--color-muted)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                flexShrink: 0,
                textAlign: 'right'
              }}
            >
              {ing.amount} {ing.unit}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
