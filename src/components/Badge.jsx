import React from 'react'

// Amber ingredient count badge with textured finish
export default function Badge({ count, label }) {
  return (
    <span className="ingredient-badge">
      {count} {label || (count === 1 ? 'ingredient' : 'ingredients')}
    </span>
  )
}

// Category label badge — color varies by category
export function CategoryBadge({ category }) {
  const cat = (category || '').toLowerCase()
  const cls =
    cat === 'baking' ? 'badge-baking' :
    cat === 'cooking' ? 'badge-cooking' :
    cat === 'desserts' ? 'badge-desserts' :
    'badge-baking'

  return (
    <span
      className={`${cls} inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide`}
      style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em' }}
    >
      {category}
    </span>
  )
}
