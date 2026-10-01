import React from 'react'

/** Renders "Who *we are*" as `Who <span class="o">we are</span>`. */
export const Highlight: React.FC<{ text?: string | null }> = ({ text }) => {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <span className="o" key={i}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

export const plainText = (text?: string | null) => (text || '').replace(/\*/g, '')
