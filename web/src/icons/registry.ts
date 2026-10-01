/**
 * Icon library shared by the admin (as select options) and the frontend (<Icon />).
 * Plain strings only — no React — so it can be imported from Payload config files.
 *
 * kind:
 *  - line:  24×24 stroke icons (services, UI)
 *  - fleet: 96×56 machine silhouettes; paths with class="acc" use the brand colour
 *  - badge: 56×56 icons drawn inside a filled circle (technology list)
 */
export type IconKind = 'line' | 'fleet' | 'badge'

export type IconDef = { label: string; kind: IconKind; body: string }

export const icons = {
  // ---------- services ----------
  mulch: {
    label: 'Forestry mulching (tree)',
    kind: 'line',
    body: '<path d="M12 3l5 7h-3l4 6H6l4-6H7z"/><path d="M12 16v5"/><path d="M4 21h3M17 21h3"/>',
  },
  clear: {
    label: 'Land clearing (shrub)',
    kind: 'line',
    body: '<path d="M12 21v-6"/><circle cx="12" cy="9" r="5"/><path d="M3 21h18"/><path d="M5 18c1-1.5 2-1.5 3 0M16 18c1-1.5 2-1.5 3 0"/>',
  },
  grade: {
    label: 'Grading (dozer)',
    kind: 'line',
    body: '<rect x="8" y="14" width="12" height="5" rx="2.5"/><path d="M10 14v-4h7v4M13 10V6h3v4M8 13H5M5 9v10"/><path d="M2 21h20"/>',
  },
  demo: {
    label: 'Demolition (wrecking ball)',
    kind: 'line',
    body: '<path d="M3 21V11h8v10M3 15h8M7 11v10"/><path d="M13 3h8M17 3v6"/><circle cx="17" cy="12" r="3"/>',
  },
  excav: {
    label: 'Excavation (excavator)',
    kind: 'line',
    body: '<rect x="9" y="17" width="12" height="4" rx="2"/><path d="M11 17v-4h8v4M15 13V9h3l1 4M11 12 7 5 3 9M3 9l-1 4h4z"/>',
  },
  drive: {
    label: 'Driveway / road',
    kind: 'line',
    body: '<path d="M9 3 5 21M15 3l4 18M12 4v2M12 9v3M12 15v5"/>',
  },
  pad: {
    label: 'Building pad (house on slab)',
    kind: 'line',
    body: '<path d="M2 20h20l-2-3H4z"/><path d="M6 17v-6l6-5 6 5v6"/><path d="M10 17v-4h4v4"/>',
  },
  clean: {
    label: 'Clean up (dump truck)',
    kind: 'line',
    body: '<path d="M2 6h11l-1 8H3z"/><path d="M13 14V9h4l4 3v2"/><path d="M2 14h19"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  },
  pavers: {
    label: 'Pavers (brick pattern)',
    kind: 'line',
    body: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19"/>',
  },
  roof: {
    label: 'Siding / roofing (house)',
    kind: 'line',
    body: '<path d="M2 11 12 3l10 8"/><path d="M5 9v12h14V9"/><path d="M5 14h14M5 17.5h14"/>',
  },
  // ---------- general UI ----------
  arrow: { label: 'Arrow right', kind: 'line', body: '<path d="M4 12h15M13 6l6 6-6 6"/>' },
  arrowUpRight: { label: 'Arrow up-right', kind: 'line', body: '<path d="M7 17 17 7M8 7h9v9"/>' },
  check: { label: 'Check mark', kind: 'line', body: '<path d="M4 12l5 5L20 6"/>' },
  phone: {
    label: 'Phone',
    kind: 'line',
    body: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  },
  pin: {
    label: 'Map pin',
    kind: 'line',
    body: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  },
  area: {
    label: 'Area (dashed square)',
    kind: 'line',
    body: '<path d="M4 4h16v16H4z" stroke-dasharray="3 3"/>',
  },
  calendar: {
    label: 'Calendar',
    kind: 'line',
    body: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  },
  clock: {
    label: 'Clock',
    kind: 'line',
    body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  },
  shield: {
    label: 'Shield (licensed / insured)',
    kind: 'line',
    body: '<path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  },
  star: {
    label: 'Star',
    kind: 'line',
    body: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  },
  users: {
    label: 'Team',
    kind: 'line',
    body: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.5 3.2-5.5 6.5-5.5s5.9 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.5 3.5 5.2"/>',
  },
  leaf: {
    label: 'Leaf (eco)',
    kind: 'line',
    body: '<path d="M5 19c0-9 5-14 15-15-1 10-6 15-15 15z"/><path d="M5 19 13 11"/>',
  },
  truck: {
    label: 'Truck',
    kind: 'line',
    body: '<path d="M2 6h12v10H2zM14 10h4l4 4v2h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  },
  hammer: {
    label: 'Hammer',
    kind: 'line',
    body: '<path d="m14 6 4 4M3 21l9-9M12 4l3-1 6 6-1 3-3-3-2 2-4-4 2-2z"/>',
  },
  award: {
    label: 'Award',
    kind: 'line',
    body: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  },
  handshake: {
    label: 'Handshake',
    kind: 'line',
    body: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1.4 1.4 0 0 1-2-2l2.8-2.8a4 4 0 0 1 4.7-.6l.6.3a3 3 0 0 0 2 .3L21 6"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1.4 1.4 0 0 0 2-2M3 4h8"/>',
  },
  mail: {
    label: 'Email',
    kind: 'line',
    body: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  },
  // ---------- fleet (equipment page) ----------
  fleetExcavator: {
    label: 'Fleet: excavator',
    kind: 'fleet',
    body: '<rect x="34" y="42" width="46" height="10" rx="5"/><path d="M40 42V32h32v10"/><path class="acc" d="M56 32V19h12l2 13"/><path d="M44 30 30 10 14 20"/><path class="acc" d="M14 20 8 32h12z"/>',
  },
  fleetMulcher: {
    label: 'Fleet: forestry mulcher',
    kind: 'fleet',
    body: '<rect x="38" y="42" width="44" height="10" rx="5"/><path d="M44 42V28h26v14"/><path class="acc" d="M56 28V16h12v12"/><path d="M44 35H32"/><circle class="acc" cx="22" cy="38" r="11"/><path d="M22 24v-3M22 55v-3M8 38H5M39 38h-3M12 28l-2-2M32 48l2 2M12 48l-2 2M32 28l2-2"/>',
  },
  fleetSkid: {
    label: 'Fleet: track / skid steer',
    kind: 'fleet',
    body: '<path d="M40 46V24h22l8 10v12"/><path class="acc" d="M46 24v12h14"/><circle cx="46" cy="46" r="6"/><circle cx="64" cy="46" r="6"/><path d="M40 30 26 36"/><path class="acc" d="M26 30v14h-10l-3-11z"/>',
  },
  fleetDozer: {
    label: 'Fleet: dozer',
    kind: 'fleet',
    body: '<rect x="28" y="40" width="54" height="12" rx="6"/><path d="M36 40V28h38v12"/><path class="acc" d="M54 28V15h14v13"/><path d="M28 34h-8"/><path class="acc" d="M20 20c-5 7-5 20 0 28"/>',
  },
  fleetWheelLoader: {
    label: 'Fleet: wheel loader',
    kind: 'fleet',
    body: '<circle cx="42" cy="44" r="8"/><circle cx="72" cy="44" r="8"/><path d="M32 40V30h52v10"/><path class="acc" d="M62 30V15h14v15"/><path d="M32 33 20 30"/><path class="acc" d="M20 22 10 26l2 14h10z"/>',
  },
  fleetDumpTruck: {
    label: 'Fleet: dump truck',
    kind: 'fleet',
    body: '<path class="acc" d="M10 16h46l-4 22H14z"/><path d="M58 40V24h12l10 10v6"/><path d="M10 40h70"/><circle cx="24" cy="45" r="6"/><circle cx="44" cy="45" r="6"/><circle cx="72" cy="45" r="6"/>',
  },
  // ---------- technology badges ----------
  techGps: {
    label: 'Tech: GPS / target',
    kind: 'badge',
    body: '<circle cx="28" cy="28" r="18"/><circle cx="28" cy="28" r="7"/><path d="M28 4v10M28 42v10M4 28h10M42 28h10"/>',
  },
  techDrone: {
    label: 'Tech: drone',
    kind: 'badge',
    body: '<rect x="20" y="22" width="16" height="12" rx="3"/><circle cx="10" cy="12" r="6"/><circle cx="46" cy="12" r="6"/><circle cx="10" cy="44" r="6"/><circle cx="46" cy="44" r="6"/><path d="M15 16l5 6M41 16l-5 6M15 40l5-6M41 40l-5-6"/>',
  },
  techLaser: {
    label: 'Tech: laser level',
    kind: 'badge',
    body: '<path d="M28 18v6M20 52l8-28 8 28M22 44h12"/><rect x="22" y="8" width="12" height="10" rx="2"/><path d="M36 13h16M4 13h14" stroke-dasharray="3 4"/>',
  },
  techDoc: {
    label: 'Tech: digital document',
    kind: 'badge',
    body: '<rect x="10" y="8" width="36" height="40" rx="4"/><path d="M18 20h20M18 28h20M18 36h12"/>',
  },
} satisfies Record<string, IconDef>

export type IconName = keyof typeof icons

export const iconOptions = (kinds?: IconKind[]) =>
  (Object.entries(icons) as [IconName, IconDef][])
    .filter(([, def]) => !kinds || kinds.includes(def.kind))
    .map(([value, def]) => ({ label: def.label, value }))
