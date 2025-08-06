import { ProjectOverview } from "@/features/projects/project-overview";

export default function ProjectDetailPage() {
    return (
        <div className="space-y-6">
            <ProjectOverview />
            {/* Additional components can be added here, such as repositories or team details */}
            <div className="gap-6 grid md:grid-cols-2"></div>
        </div>
    );
}
