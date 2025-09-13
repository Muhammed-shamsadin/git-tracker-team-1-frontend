import { useEffect, useState, useMemo } from "react";
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
        fetchedUser,
        fetchUserById,
        isLoading: userLoading,
        error: userError,
    } = useUserStore();
    const {
        memberStatsData,
        fetchMemberStats,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberId]);

    // Fetch project repositories
    useEffect(() => {
        if (projectId) {
            fetchProjectRepositories(projectId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    // Fetch member stats and recent commits
    useEffect(() => {
        if (memberId && projectId) {
            // Fetch stats for calculations (high limit)
            fetchMemberStats({
                developerId: memberId,
                projectId: projectId,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberId, projectId]);

    // Update local stats when store stats are available
    useEffect(() => {
        if (memberStatsData) {
            const newStats = {
                total_commits: memberStatsData.totalCommits,
                total_repositories: memberStatsData.uniqueRepositories,
                lines_added: memberStatsData.totalLinesAdded,
                lines_removed: memberStatsData.totalLinesRemoved,
            };

            // Only update if stats have actually changed
            setMemberStats((prevStats) => {
                if (
                    prevStats.total_commits !== newStats.total_commits ||
                    prevStats.total_repositories !==
                        newStats.total_repositories ||
                    prevStats.lines_added !== newStats.lines_added ||
                    prevStats.lines_removed !== newStats.lines_removed
                ) {
                    return newStats;
                }
                return prevStats;
            });
        }
    }, [memberStatsData]);

    // Transform user data to match component interface
    const memberData = useMemo(() => {
        return fetchedUser
            ? {
                  user_id: fetchedUser._id || fetchedUser.id,
                  name: fetchedUser.fullName,
                  email: fetchedUser.email,
                  role: fetchedUser.userType,
                  avatar: fetchedUser.profileImage || "/placeholder.svg",
                  joined_at: fetchedUser.createdAt,
                  last_active: fetchedUser.lastLogin
                      ? new Date(fetchedUser.lastLogin).toLocaleDateString()
                      : "N/A",
                  location: fetchedUser.profile?.location || "",
                  bio: fetchedUser.profile?.bio || "No bio available",
                  skills: fetchedUser.profile?.skills || [],
                  total_commits: memberStats.total_commits,
                  total_repositories: memberStats.total_repositories,
                  lines_added: memberStats.lines_added,
                  lines_removed: memberStats.lines_removed,
              }
            : null;
    }, [fetchedUser, memberStats]);

    return {
        memberData,
        memberStats,
        isLoading: userLoading || commitsLoading,
        error: userError || commitsError,
    };
}
