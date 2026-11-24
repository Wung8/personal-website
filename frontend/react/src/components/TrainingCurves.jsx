import { useId } from 'react'
import './TrainingCurves.css'

/**
 * Training curves for a write-up: one small chart per environment, each with
 * the same series (e.g. two libraries), on its own y scale and a shared look.
 *
 *   series – [{ key, label, slot?, endLabel? }] in legend order. Colors come from
 *            --series-1, --series-2, … in TrainingCurves.css: `slot` picks one
 *            (so the same thing keeps its color across figures), else by position.
 *            `endLabel` is a short name written at the end of the line.
 *   charts – [{ id, title, yLabel, xLabel?, points: { [seriesKey]: [[x, median, low, high], …] } }]
 *            x is environment frames (or whatever xLabel says); median/low/high are episode returns
 *            (e.g. the median and the worst/best seed in that stretch of training).
 *   note   – optional line under the charts (how the data was made).
 */
export default function TrainingCurves({ series, charts, note }) {
  return (
    <figure className="curves">
      <ul className="curves__legend" aria-label="Legend">
        {series.map((s, i) => (
          <li key={s.key}>
            <span className="curves__swatch" style={{ background: seriesColor(s, i) }} />
            {s.label}
          </li>
        ))}
        <li className="curves__legend-band">
          <span className="curves__swatch curves__swatch--band" />
          Range across seeds
        </li>
      </ul>
      <div className="curves__grid">
        {charts.map((chart) => (
          <Chart key={chart.id} chart={chart} series={series} />
        ))}
      </div>
      {note && <figcaption className="curves__note">{note}</figcaption>}
    </figure>
  )
}

const W = 360
const H = 220
const LABEL_GAP = 15 // min px between end-of-line labels

function Chart({ chart, series }) {
  const titleId = useId()
  // Series with an `endLabel` get it written at the end of their line, so the
  // right margin grows to fit it.
  const labeled = series.some((s) => s.endLabel)
  const PAD = { top: 12, right: labeled ? 58 : 14, bottom: 34, left: 46 }
  const PW = W - PAD.left - PAD.right
  const PH = H - PAD.top - PAD.bottom

  const all = series.flatMap((s) => chart.points[s.key] ?? [])
  const xMax = Math.max(...all.map((p) => p[0]))
  let yMin = Math.min(...all.map((p) => p[2]))
  let yMax = Math.max(...all.map((p) => p[3]))
  const yTicks = niceTicks(yMin, yMax, 4)
  yMin = Math.min(yMin, yTicks[0])
  yMax = Math.max(yMax, yTicks[yTicks.length - 1])
  const xTicks = niceTicks(0, xMax, 4).filter((t) => t <= xMax * 1.001)

  const sx = (x) => PAD.left + (x / xMax) * PW
  const sy = (y) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * PH
  const endLabels = labeled ? placeEndLabels(series, chart, sx, sy, PAD.top, PAD.top + PH) : []

  return (
    <div className="curves__chart">
      <h4 id={titleId}>{chart.title}</h4>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={titleId}>
        {yTicks.map((t) => (
          <g key={t}>
            <line className="curves__grid-line" x1={PAD.left} x2={W - PAD.right} y1={sy(t)} y2={sy(t)} />
            <text className="curves__tick" x={PAD.left - 8} y={sy(t)} textAnchor="end" dominantBaseline="middle">
              {t}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} className="curves__tick" x={sx(t)} y={H - PAD.bottom + 16} textAnchor="middle">
            {formatFrames(t)}
          </text>
        ))}
        <text className="curves__axis-label" x={PAD.left + PW / 2} y={H - 4} textAnchor="middle">
          {chart.xLabel ?? 'Environment frames'}
        </text>
        <text
          className="curves__axis-label"
          transform={`translate(11 ${PAD.top + PH / 2}) rotate(-90)`}
          textAnchor="middle"
        >
          {chart.yLabel ?? 'Episode return'}
        </text>

        {series.map((s, i) => {
          const pts = chart.points[s.key] ?? []
          if (!pts.length) return null
          const band =
            pts.map((p, j) => `${j ? 'L' : 'M'}${sx(p[0])},${sy(p[3])}`).join('') +
            pts
              .slice()
              .reverse()
              .map((p) => `L${sx(p[0])},${sy(p[2])}`)
              .join('') +
            'Z'
          const line = pts.map((p, j) => `${j ? 'L' : 'M'}${sx(p[0])},${sy(p[1])}`).join('')
          return (
            <g key={s.key} style={{ '--c': seriesColor(s, i) }}>
              <path className="curves__band" d={band} />
              <path className="curves__line" d={line} />
            </g>
          )
        })}
        {endLabels.map((l) => (
          <g key={l.key} style={{ '--c': l.color }}>
            <path className="curves__leader" d={`M${l.x + 3},${l.lineY}L${l.x + 9},${l.y}`} />
            <text className="curves__end-label" x={l.x + 12} y={l.y} dominantBaseline="middle">
              {l.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// One label per series beside its line's last point, nudged apart so none overlap.
function placeEndLabels(series, chart, sx, sy, top, bottom) {
  const labels = series
    .map((s, i) => {
      const pts = chart.points[s.key] ?? []
      if (!s.endLabel || !pts.length) return null
      const last = pts[pts.length - 1]
      // Placed at the line's average over its last 10% rather than its final
      // point, so one noisy last stretch can't swap the labels' order.
      const tail = pts.slice(-Math.max(1, Math.round(pts.length / 10)))
      const level = tail.reduce((sum, p) => sum + p[1], 0) / tail.length
      return { key: s.key, text: s.endLabel, color: seriesColor(s, i), x: sx(last[0]), lineY: sy(last[1]), y: sy(level) }
    })
    .filter(Boolean)
    .sort((a, b) => a.y - b.y)
  for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + LABEL_GAP)
  const overflow = labels.length ? labels[labels.length - 1].y - bottom : 0
  if (overflow > 0) labels.forEach((l) => (l.y -= overflow))
  labels.forEach((l) => (l.y = Math.max(l.y, top)))
  return labels
}

function seriesColor(s, i) {
  return `var(--series-${s.slot ?? i + 1})`
}

function niceTicks(min, max, count) {
  const span = max - min || 1
  const raw = span / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)
  const ticks = []
  for (let t = Math.floor(min / step) * step; t <= max + step * 0.001; t += step) ticks.push(+t.toFixed(10))
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step)
  return ticks
}

function formatFrames(x) {
  if (x >= 1e6) return `${+(x / 1e6).toFixed(1)}M`
  if (x >= 1e3) return `${Math.round(x / 1e3)}k`
  return `${x}`
}
