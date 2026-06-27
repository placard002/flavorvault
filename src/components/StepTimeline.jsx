import React from 'react'

export default function StepTimeline({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <p style={{ color: 'var(--color-muted)' }}>No steps available.</p>
    )
  }

  return (
    <ol className="space-y-0">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1
        return (
          <li key={step.number || idx} className="relative flex gap-5 pb-8">
            {/* Vertical line */}
            {!isLast && (
              <div
                className="absolute"
                style={{
                  left: '19px',
                  top: '44px',
                  bottom: 0,
                  width: '2px',
                  background: 'linear-gradient(to bottom, var(--color-amber), var(--color-border))'
                }}
              />
            )}

            {/* Step number circle */}
            <div className="step-circle flex-shrink-0 z-10">
              {step.number || idx + 1}
            </div>

            {/* Content */}
            <div className="flex-1 pt-2">
              <p
                style={{
                  color: 'var(--color-text)',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {step.instruction}
              </p>
              {step.imageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden" style={{ maxWidth: '480px' }}>
                  <img
                    src={step.imageUrl}
                    alt={`Step ${step.number || idx + 1}`}
                    className="w-full object-cover"
                    style={{ maxHeight: '240px' }}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
