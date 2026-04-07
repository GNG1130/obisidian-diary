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
      <div class="home-dashboard-stack">
        <section class="hero-card">
          <h1>Raven's Research Page</h1>
          <p>
            研究筆記、實驗紀錄與專案知識的簡潔入口。
            從首頁快速查看近期活躍度、專案分類與最近編輯。
          </p>
        </section>

        <ActivityHeatmap {...props} />

        <ProjectCategories {...props} />

        <section class="dashboard-card recent-card">
          <RecentNotes {...props} />
        </section>
      </div>
    )
  }

  return HomeDashboard
}) satisfies QuartzComponentConstructor