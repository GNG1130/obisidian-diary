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

    // GitHub-style: columns are weeks, rows are weekdays
    // We pad the front so the first column starts on Sunday
    const firstDay = dates[0]
    const frontPadding = firstDay.getDay() // 0=Sun, 6=Sat

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

    const levelClass = (count: number) => {
      if (count === 0) return "lvl-0"
      const ratio = count / maxCount
      if (ratio <= 0.25) return "lvl-1"
      if (ratio <= 0.5) return "lvl-2"
      if (ratio <= 0.75) return "lvl-3"
      return "lvl-4"
    }

    const weeks: HeatCell[][] = []
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7))
    }

    const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"]

    return (
      <section class="dashboard-card">
        <div class="dashboard-card-header">
          <h2>活動熱力圖</h2>
          <span>最近 365 天</span>
        </div>

        <div class="github-heatmap-wrapper">
          <div class="weekday-labels">
            {weekdayLabels.map((label) => (
              <div class="weekday-label">{label}</div>
            ))}
          </div>

          <div class="github-heatmap">
            {weeks.map((week, weekIdx) => (
              <div class="week-column" key={`week-${weekIdx}`}>
                {week.map((cell, dayIdx) =>
                  cell.empty ? (
                    <div class="heat-cell empty-cell" key={`empty-${weekIdx}-${dayIdx}`} />
                  ) : (
                    <div
                      class={`heat-cell ${levelClass(cell.count)}`}
                      title={`${cell.date}：${cell.count} 篇`}
                      key={`${cell.date}-${dayIdx}`}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <div class="heatmap-legend">
          <span>少</span>
          <div class="legend-cells">
            <i class="heat-cell lvl-0"></i>
            <i class="heat-cell lvl-1"></i>
            <i class="heat-cell lvl-2"></i>
            <i class="heat-cell lvl-3"></i>
            <i class="heat-cell lvl-4"></i>
          </div>
          <span>多</span>
        </div>
      </section>
    )
  }

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor