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
        memberCommits,
        fetchMemberCommits,
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

    // Fetch member commits data
    useEffect(() => {
        if (memberId && projectId) {
            fetchMemberCommits({
                developerId: memberId,
                projectId: projectId,
                page: 1,
            });
        }
    }, [memberId, projectId, fetchMemberCommits]);
    console.log("Member Commits:", memberCommits);
    // Calculate member stats from commits
    useEffect(() => {
        if (memberCommits && memberCommits.length > 0) {
            const stats = memberCommits.reduce(
                (acc, commit) => ({
                    total_commits: acc.total_commits + 1,
                    total_repositories: acc.total_repositories,
                    lines_added:
                        acc.lines_added + (commit.stats?.lines_added || 0),
                    lines_removed:
                        acc.lines_removed + (commit.stats?.lines_removed || 0),
                }),
                {
                    total_commits: 0,
                    total_repositories: 0,
                    lines_added: 0,
                    lines_removed: 0,
                }
            );

            // Count unique repositories
            const uniqueRepos = new Set(
                memberCommits.map((commit) => commit.repoId)
            );
            stats.total_repositories = uniqueRepos.size;

            setMemberStats(stats);
        }
    }, [memberCommits]);
    console.log("Member Stats before replay:", memberStats);

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
    const transformedCommits = (memberCommits || []).map((commit) => ({
        id: commit.commitHash,
        message: commit.message,
        repository: repoMap[commit.repoId] || commit.repoId,
        branch: commit.branch,
        files_changed: commit.stats?.files_changed || 0,
        lines_added: commit.stats?.lines_added || 0,
        lines_removed: commit.stats?.lines_removed || 0,
        timestamp: commit.timestamp,
    }));
    console.log("Transformed Commits:", transformedCommits);
    console.log("Member Stats:", memberStats);
    return {
        memberData,
        transformedCommits,
        memberStats,
        isLoading: userLoading || commitsLoading,
        error: userError || commitsError,
        repoMap,
    };
}
