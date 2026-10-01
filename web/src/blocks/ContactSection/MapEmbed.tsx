'use client'

import React, { useState } from 'react'

/** Click-to-load Google Map: no third-party requests or cookies until the visitor asks for it. */
export const MapEmbed: React.FC<{ address: string }> = ({ address }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="map-embed">
      {show ? (
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
          title={`Map: ${address}`}
        />
      ) : (
        <button className="btn btn-outline" onClick={() => setShow(true)} type="button">
          Show map — {address}
        </button>
      )}
    </div>
  )
}
