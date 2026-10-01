import React from 'react'

/** "Download as spreadsheet" link shown above the Quote requests list. */
export const LeadsExport: React.FC = () => (
  <div style={{ margin: '0 0 16px' }}>
    <a
      download
      href="/api/leads-export"
      style={{
        display: 'inline-block',
        padding: '8px 14px',
        borderRadius: 6,
        border: '1px solid var(--theme-elevation-200)',
        background: 'var(--theme-elevation-50)',
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      ⬇ Download all as a spreadsheet (CSV)
    </a>
  </div>
)
