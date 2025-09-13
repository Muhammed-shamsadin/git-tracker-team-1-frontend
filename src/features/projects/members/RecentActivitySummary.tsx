import { RecentActivity } from "../recent-activity";
import { useParams } from "next/navigation";

export function RecentActivitySummary() {
    const { id: projectId, memberid: memberId } = useParams();

    return (
        <RecentActivity
            projectId={projectId as string}
            developerId={memberId as string}
            title="Recent Member Activity"
            limit={5}
            showRepository={true}
            showDeveloper={false}
        />
    );
}
