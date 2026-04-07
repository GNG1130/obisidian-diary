import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, simplifySlug } from "../util/path"

function getFileDate(file: QuartzComponentProps["allFiles"][number]): Date | null {
  return file.dates?.modified ?? file.dates?.created ?? file.dates?.published ?? null
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

type ProjectInfo = {
  count: number
  latestDate: Date | null
  landingSlug: FullSlug | null
}

export default (() => {
  function ProjectCategories({ allFiles, fileData }: QuartzComponentProps) {
    const stats = new Map<string, ProjectInfo>()

    for (const file of allFiles) {
      const project = file.frontmatter?.project
      if (!project || typeof project !== "string" || !file.slug) continue

      const fileDate = getFileDate(file)
      const existing = stats.get(project)

      // 關鍵：用 simplifySlug 判斷 project landing page
      // 例如 content/rag-research/index.md 的 FullSlug 可能是 rag-research/index
      // simplify 後才會是 rag-research
      const simplified = simplifySlug(file.slug)
      const isLandingPage = simplified === project
      const candidateLanding = isLandingPage ? (file.slug as FullSlug) : existing?.landingSlug ?? null

      if (!existing) {
        stats.set(project, {
          count: 1,
          latestDate: fileDate,
          landingSlug: candidateLanding,
        })
      } else {
        let latestDate = existing.latestDate
        if (fileDate && (!latestDate || fileDate > latestDate)) {
          latestDate = fileDate
        }

        stats.set(project, {
          count: existing.count + 1,
          latestDate,
          landingSlug: existing.landingSlug ?? candidateLanding,
        })
      }
    }

    const items = Array.from(stats.entries()).sort((a, b) => {
      const dateA = a[1].latestDate?.getTime() ?? 0
      const dateB = b[1].latestDate?.getTime() ?? 0

      if (dateB !== dateA) return dateB - dateA
      if (b[1].count !== a[1].count) return b[1].count - a[1].count
      return a[0].localeCompare(b[0])
    })

    return (
      <section class="dashboard-card">
        <div class="dashboard-card-header">
          <h2>專案分類</h2>
          <span>{items.length} 個專案</span>
        </div>

        {items.length > 0 ? (
          <div class="project-grid">
            {items.map(([name, info]) => {
              const href =
                info.landingSlug != null
                  ? resolveRelative(fileData.slug!, info.landingSlug)
                  : undefined

              return href ? (
                <a class="project-item project-link internal" href={href}>
                  <div class="project-main">
                    <span class="project-name">{name}</span>
                    <span class="project-date">
                      最近更新：{info.latestDate ? formatDate(info.latestDate) : "未知"}
                    </span>
                  </div>
                  <span class="project-count">{info.count}</span>
                </a>
              ) : (
                <div class="project-item project-link project-disabled">
                  <div class="project-main">
                    <span class="project-name">{name}</span>
                    <span class="project-date">
                      最近更新：{info.latestDate ? formatDate(info.latestDate) : "未知"}
                    </span>
                  </div>
                  <span class="project-count">{info.count}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p class="empty-state">尚未偵測到 project frontmatter。</p>
        )}
      </section>
    )
  }

  return ProjectCategories
}) satisfies QuartzComponentConstructor