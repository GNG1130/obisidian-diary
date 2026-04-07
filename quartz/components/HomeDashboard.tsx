import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import ActivityHeatmapConstructor from "./ActivityHeatmap"
import ProjectCategoriesConstructor from "./ProjectCategories"
import RecentNotesConstructor from "./RecentNotes"

const ActivityHeatmap = ActivityHeatmapConstructor()
const ProjectCategories = ProjectCategoriesConstructor()
const RecentNotes = RecentNotesConstructor({
  title: "最近編輯",
  limit: 8,
  showTags: false,
})

export default (() => {
  function HomeDashboard(props: QuartzComponentProps) {
    return (
      <div class="home-dashboard">
        <section class="home-hero-card">
          <h1>Raven's Research Page</h1>
          <p>
            研究筆記、實驗紀錄與專案知識的小地方。
          </p>
        </section>

        <div class="home-grid">
          <aside class="home-sidebar">
            <ProjectCategories {...props} />
          </aside>

          <main class="home-main">
            <ActivityHeatmap {...props} />

            <section class="home-card recent-card">
              <RecentNotes {...props} />
            </section>
          </main>
        </div>
      </div>
    )
  }

  return HomeDashboard
}) satisfies QuartzComponentConstructor