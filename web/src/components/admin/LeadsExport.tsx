import React from 'react'

import { Icon } from './icons'

/** "Download as spreadsheet" link shown above the Quote requests list. */
export const LeadsExport: React.FC = () => (
  <div style={{ margin: '0 0 16px' }}>
    <a className="mb-btn" download href="/api/leads-export">
      <Icon name="download" size={18} /> Download all as a spreadsheet (CSV)
    </a>
  </div>
)
