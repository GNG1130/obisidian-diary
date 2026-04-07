import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
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

    const cells: { date: string; count: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = formatDateKey(d)
      cells.push({
        date: key,
        count: counts.get(key) ?? 0,
      })
    }

    const maxCount = Math.max(...cells.map((c) => c.count), 1)

    const levelClass = (count: number) => {
      if (count === 0) return "lvl-0"
      const ratio = count / maxCount
      if (ratio <= 0.25) return "lvl-1"
      if (ratio <= 0.5) return "lvl-2"
      if (ratio <= 0.75) return "lvl-3"
      return "lvl-4"
    }

    return (
      <section class="dashboard-card">
        <div class="dashboard-card-header">
          <h2>活動熱力圖</h2>
          <span>最近 365 天</span>
        </div>

        <div class="activity-heatmap">
          {cells.map((cell) => (
            <div
              class={`heat-cell ${levelClass(cell.count)}`}
              title={`${cell.date}：${cell.count} 篇`}
            />
          ))}
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