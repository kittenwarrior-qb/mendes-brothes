'use client'

import React, { useRef, useState } from 'react'

type Point = { day: string; visitors: number; views: number }

const W = 960
const H = 260
const PAD = { top: 16, right: 16, bottom: 28, left: 44 }

const label = (day: string, long = false) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(long ? { weekday: 'short' } : {}),
    timeZone: 'UTC',
  })

/** A round number at or above the largest value, and the tick step that divides it. */
const scaleFor = (max: number) => {
  if (max <= 4) return { top: 4, step: 1 }
  const rough = max / 4
  const pow = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? 10 * pow
  return { top: step * 4, step }
}

/**
 * Visitors per day: one series, so a 2px line over a light wash, no legend (the heading
 * names it). Hovering or focusing a day shows that day's visitors and page views; the
 * same numbers are in the table below the chart for anyone who cannot hover.
 */
export const TrendChart: React.FC<{ data: Point[] }> = ({ data }) => {
  const [active, setActive] = useState<number | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const { top, step } = scaleFor(Math.max(...data.map((d) => d.visitors), 1))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) =>
    PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - (v / top) * innerH
  const line = data
    .map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.visitors).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${x(data.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`
  // about six date labels, whatever the range
  const every = Math.max(1, Math.ceil(data.length / 6))

  const nearest = (clientX: number) => {
    const box = svg.current?.getBoundingClientRect()
    if (!box) return null
    const px = ((clientX - box.left) / box.width) * W
    const i = Math.round(((px - PAD.left) / innerW) * (data.length - 1))
    return Math.max(0, Math.min(data.length - 1, i))
  }
  const point = active === null ? null : data[active]

  return (
    <div className="mb-chart">
      <svg
        aria-label="Visitors per day"
        onPointerLeave={() => setActive(null)}
        onPointerMove={(e) => setActive(nearest(e.clientX))}
        ref={svg}
        role="img"
        viewBox={`0 0 ${W} ${H}`}
      >
        {Array.from({ length: 5 }, (_, i) => i * step).map((tick) => (
          <g key={tick}>
            <line
              className="mb-chart__grid"
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
            />
            <text className="mb-chart__tick" textAnchor="end" x={PAD.left - 10} y={y(tick) + 4}>
              {tick.toLocaleString('en-US')}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % every === 0 || i === data.length - 1 ? (
            <text
              className="mb-chart__tick"
              key={d.day}
              textAnchor={i === data.length - 1 ? 'end' : i === 0 ? 'start' : 'middle'}
              x={x(i)}
              y={H - 6}
            >
              {label(d.day)}
            </text>
          ) : null,
        )}
        <path className="mb-chart__area" d={area} />
        <path className="mb-chart__line" d={line} />
        {point && active !== null ? (
          <>
            <line
              className="mb-chart__cross"
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={y(0)}
            />
            <circle className="mb-chart__dot" cx={x(active)} cy={y(point.visitors)} r={5} />
          </>
        ) : null}
        {/* keyboard: each day can be focused, and shows the same readout as hovering */}
        {data.map((d, i) => (
          <rect
            aria-label={`${label(d.day, true)}: ${d.visitors} visitors, ${d.views} page views`}
            className="mb-chart__hit"
            height={innerH}
            key={d.day}
            onBlur={() => setActive(null)}
            onFocus={() => setActive(i)}
            tabIndex={0}
            width={Math.max(4, innerW / data.length)}
            x={x(i) - Math.max(4, innerW / data.length) / 2}
            y={PAD.top}
          />
        ))}
      </svg>
      {point && active !== null ? (
        <div
          className="mb-chart__tip"
          style={{
            left: `${(x(active) / W) * 100}%`,
            transform: `translateX(${active > data.length / 2 ? 'calc(-100% - 12px)' : '12px'})`,
          }}
        >
          <span>{label(point.day, true)}</span>
          <strong>
            <i className="mb-chart__key" />
            {point.visitors.toLocaleString('en-US')} <em>visitors</em>
          </strong>
          <strong>
            {point.views.toLocaleString('en-US')} <em>page views</em>
          </strong>
        </div>
      ) : null}
    </div>
  )
}
