import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Clock, Users, ChefHat } from 'lucide-react'
import { CategoryBadge } from './Badge.jsx'
import Badge from './Badge.jsx'
import { favoritesAPI } from '../api/client.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const DIFFICULTY_COLORS = {
  Easy: '#7A9E7E',
  Medium: '#D4830A',
  Hard: '#C0392B'
}

export default function RecipeCard({ recipe, onFavoriteChange }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [favorited, setFavorited] = useState(recipe.isFavorited || false)
  const [favLoading, setFavLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  async function handleFavorite(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (favLoading) return
    setFavLoading(true)

    const newState = !favorited
    setFavorited(newState) // optimistic

    try {
      if (newState) {
        await favoritesAPI.add(recipe.id)
      } else {
        await favoritesAPI.remove(recipe.id)
      }
      if (onFavoriteChange) onFavoriteChange(recipe.id, newState)
    } catch (err) {
      setFavorited(!newState) // revert
      console.error('Favorite error:', err)
    } finally {
      setFavLoading(false)
    }
  }

  const fallbackImg = {
    baking: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    cooking: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    desserts: 'https://images.unsplash.com/photo-1488477181228-c84def11de88?w=800'
  }

  const imgSrc = imgError
    ? (fallbackImg[(recipe.category || '').toLowerCase()] || fallbackImg.cooking)
    : recipe.imageUrl

  return (
    <Link to={`/recipes/${recipe.id}`} className="block">
      <article
        className="recipe-card bg-white rounded-2xl overflow-hidden"
        style={{ border: '1.5px solid var(--color-border)', boxShadow: '0 2px 8px rgba(28,20,16,0.06)' }}
      >
        {/* Image — 4:3 ratio */}
        <div className="relative overflow-hidden" style={{ paddingTop: '75%' }}>
          <img
            src={imgSrc}
            alt={recipe.title}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.4) 0%, transparent 50%)' }}
          />
          {/* Category badge top-left */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={recipe.category} />
          </div>
          {/* Favorite button top-right */}
          <button
            onClick={handleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.4)'
            }}
          >
            <Heart
              size={14}
              fill={favorited ? '#E8B4A0' : 'none'}
              stroke={favorited ? '#C4785A' : '#8C7B6B'}
              strokeWidth={2}
            />
          </button>
          {/* Ingredient count badge bottom-left */}
          <div className="absolute bottom-3 left-3">
            <Badge count={recipe.ingredientCount} />
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          <h3
            className="font-display text-base font-bold mb-1 line-clamp-2 leading-snug"
            style={{ color: 'var(--color-text)', fontSize: '17px', fontFamily: 'Fraunces, serif' }}
          >
            {recipe.title}
          </h3>
          <p
            className="line-clamp-2 mb-3"
            style={{ color: 'var(--color-muted)', fontSize: '13px', lineHeight: '1.5' }}
          >
            {recipe.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1" style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
              <Clock size={12} />
              {totalTime}m
            </span>
            <span className="flex items-center gap-1" style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
              <Users size={12} />
              {recipe.servings}
            </span>
            <span className="flex items-center gap-1" style={{ fontSize: '12px' }}>
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: DIFFICULTY_COLORS[recipe.difficulty] || DIFFICULTY_COLORS.Medium }}
              />
              <span style={{ color: DIFFICULTY_COLORS[recipe.difficulty] || DIFFICULTY_COLORS.Medium, fontWeight: 500 }}>
                {recipe.difficulty}
              </span>
            </span>
            {recipe.cuisine && (
              <span style={{ color: 'var(--color-muted)', fontSize: '12px', marginLeft: 'auto' }}>
                {recipe.cuisine}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
