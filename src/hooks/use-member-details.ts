import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useGitDataStore } from "@/stores/gitDataStore";
import { useRepositoryStore } from "@/stores/repositoryStore";

interface UseMemberDetailsProps {
    memberId: string;
    projectId: string;
}

interface MemberStats {
    total_commits: number;
    total_repositories: number;
    lines_added: number;
    lines_removed: number;
}

export function useMemberDetails({
    memberId,
    projectId,
}: UseMemberDetailsProps) {
    const {
        currentUser,
        fetchUserById,
        isLoading: userLoading,
        error: userError,
    } = useUserStore();
    const {
        memberCommitsForDisplay,
        memberStatsData,
        fetchMemberStats,
        fetchMemberRecentCommits,
        isLoading: commitsLoading,
        error: commitsError,
    } = useGitDataStore();
    const { projectRepositories, fetchProjectRepositories } =
        useRepositoryStore();

    const [memberStats, setMemberStats] = useState<MemberStats>({
        total_commits: 0,
        total_repositories: 0,
        lines_added: 0,
        lines_removed: 0,
    });

    // Fetch user data
    useEffect(() => {
        if (memberId) {
            fetchUserById(memberId);
        }
    }, [memberId, fetchUserById]);

    // Fetch project repositories
    useEffect(() => {
        if (projectId) {
            fetchProjectRepositories(projectId);
        }
    }, [projectId, fetchProjectRepositories]);

    // Fetch member stats and recent commits
    useEffect(() => {
        if (memberId && projectId) {
            // Fetch stats for calculations (high limit)
            fetchMemberStats({
                developerId: memberId,
                projectId: projectId,
            });

            // Fetch recent commits for display (low limit)
            fetchMemberRecentCommits({
                developerId: memberId,
                projectId: projectId,
                limit: 10, // Only fetch 10 for display
            });
        }
    }, [memberId, projectId, fetchMemberStats, fetchMemberRecentCommits]);

    // Update local stats when store stats are available
    useEffect(() => {
        if (memberStatsData) {
            setMemberStats({
                total_commits: memberStatsData.totalCommits,
                total_repositories: memberStatsData.uniqueRepositories,
                lines_added: memberStatsData.totalLinesAdded,
                lines_removed: memberStatsData.totalLinesRemoved,
            });
        }
    }, [memberStatsData]);

    // Create a map of repo IDs to repo names
    const repoMap = (projectRepositories || []).reduce((acc, repo) => {
        acc[repo._id] = repo.name;
        return acc;
    }, {} as Record<string, string>);

    // Transform user data to match component interface
    const memberData = currentUser
        ? {
              user_id: currentUser._id || currentUser.id,
              name: currentUser.fullName,
              email: currentUser.email,
              role: currentUser.userType,
              avatar: currentUser.profileImage || "/placeholder.svg",
              joined_at: currentUser.createdAt,
              last_active: currentUser.lastLogin
                  ? new Date(currentUser.lastLogin).toLocaleDateString()
                  : "N/A",
              location: currentUser.profile?.location || "",
              bio: currentUser.profile?.bio || "No bio available",
              skills: currentUser.profile?.skills || [],
              total_commits: memberStats.total_commits,
              total_repositories: memberStats.total_repositories,
              lines_added: memberStats.lines_added,
              lines_removed: memberStats.lines_removed,
          }
        : null;
    console.log("Member Data:", memberData);
    // Transform commits data to match component interface
    const transformedCommits = (memberCommitsForDisplay || []).map(
        (commit) => ({
            id: commit._id,
            message: commit.message,
            repository:
                repoMap[
                    typeof commit.repoId === "string"
                        ? commit.repoId
                        : commit.repoId._id
                ] ||
                (typeof commit.repoId === "string"
                    ? commit.repoId
                    : commit.repoId._id),
            repositoryId:
                typeof commit.repoId === "string"
                    ? commit.repoId
                    : commit.repoId._id,
            branch: commit.branch,
            files_changed: commit.stats?.files_changed || 0,
            lines_added: commit.stats?.lines_added || 0,
            lines_removed: commit.stats?.lines_removed || 0,
            timestamp: commit.timestamp,
        })
    );
    console.log("Transformed Commits:", transformedCommits);
    console.log("Member Stats:", memberStats);
    console.log("Store Stats Data:", memberStatsData);
    return {
        memberData,
        transformedCommits,
        memberStats,
        isLoading: userLoading || commitsLoading,
        error: userError || commitsError,
        repoMap,
    };
}
