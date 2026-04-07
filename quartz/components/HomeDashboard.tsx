import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import ActivityHeatmap from "./ActivityHeatmap"
import ProjectCategories from "./ProjectCategories"
import RecentNotes from "./RecentNotes"

export default (() => {
  function HomeDashboard(props: QuartzComponentProps) {
    return (
      <div class="home-dashboard">
        <section class="home-hero-card">
          <div class="home-hero-badge">Knowledge Dashboard</div>
          <h1>Raven's Research Page</h1>
          <p>
            研究筆記、實驗紀錄與專案知識的簡潔入口。
            從首頁快速查看近期活躍度、最近編輯與專案分類。
          </p>
        </section>

        <div class="home-grid">
          <aside class="home-sidebar">
            <ProjectCategories {...props} />
          </aside>

          <main class="home-main">
            <ActivityHeatmap {...props} />

            <section class="home-card recent-card">
              <RecentNotes {...props} title="最近編輯" limit={8} showTags={false} />
            </section>
          </main>
        </div>
      </div>
    )
  }

  return HomeDashboard
}) satisfies QuartzComponentConstructor