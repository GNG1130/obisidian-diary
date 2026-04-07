import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  function ProjectCategories({ allFiles }: QuartzComponentProps) {
    const stats = new Map<string, number>()

    for (const file of allFiles) {
      const project = file.frontmatter?.project
      if (!project || typeof project !== "string") continue
      stats.set(project, (stats.get(project) ?? 0) + 1)
    }

    const items = Array.from(stats.entries()).sort((a, b) => b[1] - a[1])

    return (
      <section class="home-card">
        <div class="card-header">
          <h2>專案分類</h2>
          <span>{items.length} 個專案</span>
        </div>

        <div class="project-list">
          {items.length > 0 ? (
            items.map(([name, count]) => (
              <div class="project-item">
                <span class="project-name">{name}</span>
                <span class="project-count">{count}</span>
              </div>
            ))
          ) : (
            <p class="empty-state">尚未偵測到 project frontmatter。</p>
          )}
        </div>
      </section>
    )
  }

  return ProjectCategories
}) satisfies QuartzComponentConstructor