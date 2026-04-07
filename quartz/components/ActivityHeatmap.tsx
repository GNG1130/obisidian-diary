import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

type HeatCell = {
  date?: string
  count: number
  empty?: boolean
}

export default (() => {
  function ActivityHeatmap({ allFiles }: QuartzComponentProps) {
    const today = startOfDay(new Date())
    const days = 365
    const counts = new Map<string, number>()

    for (const file of allFiles) {
      const d = file.dates?.modified ?? file.dates?.created ?? file.dates?.published
      if (!d) continue
      const key = formatDateKey(startOfDay(d))
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }

    const dates: Date[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      dates.push(startOfDay(d))
    }

    const firstDay = dates[0]
    const frontPadding = firstDay.getDay()

    const cells: HeatCell[] = []

    for (let i = 0; i < frontPadding; i++) {
      cells.push({ count: 0, empty: true })
    }

    for (const d of dates) {
      const key = formatDateKey(d)
      cells.push({
        date: key,
        count: counts.get(key) ?? 0,
      })
    }

    while (cells.length % 7 !== 0) {
      cells.push({ count: 0, empty: true })
    }

    const maxCount = Math.max(...cells.filter((c) => !c.empty).map((c) => c.count), 1)

    const fillForCount = (count: number, empty?: boolean) => {
      if (empty) return "transparent"
      if (count === 0) return "var(--lightgray)"
      const ratio = count / maxCount
      if (ratio <= 0.25) return "#d6f5df"
      if (ratio <= 0.5) return "#9ee6b0"
      if (ratio <= 0.75) return "#58c97b"
      return "#229a4f"
    }

    const weeks: HeatCell[][] = []
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7))
    }

    const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const cellSize = 10
    const gap = 3
    const labelWidth = 30
    const topPadding = 2

    const heatmapWidth = weeks.length * cellSize + (weeks.length - 1) * gap
    const heatmapHeight = 7 * cellSize + 6 * gap
    const svgWidth = labelWidth + 10 + heatmapWidth
    const svgHeight = topPadding + heatmapHeight

    return (
      <section class="dashboard-card">
        <div class="dashboard-card-header">
          <h2>Activity Heatmap</h2>
          <span>Last 365 Days</span>
        </div>

        <div class="heatmap-svg-container">
          <svg
            class="heatmap-svg"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMinYMin meet"
            role="img"
            aria-label="Activity heatmap for the last 365 days"
          >
            {weekdayLabels.map((label, row) => {
              const y = topPadding + row * (cellSize + gap) + cellSize * 0.8
              return (
                <text
                  key={label}
                  x={0}
                  y={y}
                  class="heatmap-label"
                >
                  {label}
                </text>
              )
            })}

            {weeks.map((week, col) =>
              week.map((cell, row) => {
                const x = labelWidth + 10 + col * (cellSize + gap)
                const y = topPadding + row * (cellSize + gap)

                return (
                  <rect
                    key={`${col}-${row}-${cell.date ?? "empty"}`}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={2}
                    ry={2}
                    fill={fillForCount(cell.count, cell.empty)}
                  >
                    {!cell.empty && (
                      <title>{`${cell.date}：${cell.count} 篇`}</title>
                    )}
                  </rect>
                )
              }),
            )}
          </svg>
        </div>

        <div class="heatmap-legend">
          <span>少</span>
          <div class="legend-cells">
            <i class="legend-cell lvl-0"></i>
            <i class="legend-cell lvl-1"></i>
            <i class="legend-cell lvl-2"></i>
            <i class="legend-cell lvl-3"></i>
            <i class="legend-cell lvl-4"></i>
          </div>
          <span>多</span>
        </div>
      </section>
    )
  }

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor