import { useEffect, useState, useMemo, useCallback } from "react";
import { useUserStore } from "@/stores/userStore";
import { useGitDataStore } from "@/stores/gitDataStore";

interface UseMemberDetailsProps {
    memberId: string;
    projectId: string;
}

interface MemberStats {
    total_commits: number;
    total_repositories: number;
    lines_added: number;
    lines_removed: number;
    files_added: number;
    files_removed: number;
    files_changed: number;
}

interface MemberRepository {
    id: string;
    name: string;
    totalCommits: number;
}

interface MemberData {
    user_id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    joined_at: string;
    last_active: string;
    location: string;
    bio: string;
    skills: string[];
    total_commits: number;
    total_repositories: number;
    lines_added: number;
    lines_removed: number;
    files_added: number;
    files_removed: number;
    files_changed: number;
    repositories: MemberRepository[];
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
        clearError: clearUserError,
    } = useUserStore();

    const {
        memberDetailsData,
        fetchMemberDetailsOptimized,
        isLoading: gitDataLoading,
        error: gitDataError,
        clearError: clearGitDataError,
        clearMemberDetails,
    } = useGitDataStore();

    const [memberStats, setMemberStats] = useState<MemberStats>({
        total_commits: 0,
        total_repositories: 0,
        lines_added: 0,
        lines_removed: 0,
        files_added: 0,
        files_removed: 0,
        files_changed: 0,
    });

    const [fetchAttempted, setFetchAttempted] = useState(false);

    // Clear errors when component mounts or props change
    useEffect(() => {
        clearUserError();
        clearGitDataError();
        setFetchAttempted(false);
    }, [memberId, projectId, clearUserError, clearGitDataError]);

    // Fetch member details using the optimized endpoint
    const fetchMemberDetails = useCallback(async () => {
        if (!memberId || !projectId || fetchAttempted) return;

        setFetchAttempted(true);

        try {
            // Fetch user data and member details in parallel
            const [userPromise, detailsPromise] = await Promise.allSettled([
                fetchUserById(memberId),
                fetchMemberDetailsOptimized({ projectId, memberId }),
            ]);

            // Handle any rejected promises
            if (userPromise.status === "rejected") {
                console.error("Failed to fetch user data:", userPromise.reason);
            }
            if (detailsPromise.status === "rejected") {
                console.error(
                    "Failed to fetch member details:",
                    detailsPromise.reason
                );
            }
        } catch (error) {
            console.error("Error fetching member details:", error);
        }
    }, [
        memberId,
        projectId,
        fetchAttempted,
        fetchUserById,
        fetchMemberDetailsOptimized,
    ]);

    // Trigger data fetching
    useEffect(() => {
        fetchMemberDetails();
    }, [fetchMemberDetails]);

    // Update local stats when store data is available
    useEffect(() => {
        if (memberDetailsData) {
            const newStats: MemberStats = {
                total_commits: memberDetailsData.totalCommits || 0,
                total_repositories: memberDetailsData.uniqueRepos || 0,
                lines_added: memberDetailsData.totalLinesAdded || 0,
                lines_removed: memberDetailsData.totalLinesRemoved || 0,
                files_added: memberDetailsData.totalFilesAdded || 0,
                files_removed: memberDetailsData.totalFilesRemoved || 0,
                files_changed: memberDetailsData.totalFilesChanged || 0,
            };

            setMemberStats(newStats);
        }
    }, [memberDetailsData]);

    // Transform user data and stats to match component interface
    const memberData = useMemo((): MemberData | null => {
        if (!fetchedUser) return null;

        return {
            user_id: fetchedUser._id || fetchedUser.id,
            name: fetchedUser.fullName || "Unknown User",
            email: fetchedUser.email || "",
            role: fetchedUser.userType || "developer",
            avatar: fetchedUser.profileImage || "/placeholder.svg",
            joined_at: fetchedUser.createdAt || "",
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
            files_added: memberStats.files_added,
            files_removed: memberStats.files_removed,
            files_changed: memberStats.files_changed,
            repositories: memberDetailsData?.repos || [],
        };
    }, [fetchedUser, memberStats, memberDetailsData]);

    // Combine errors and loading states
    const isLoading = userLoading || gitDataLoading;
    const error = userError || gitDataError;

    // Retry function for failed requests
    const retry = useCallback(() => {
        setFetchAttempted(false);
        clearUserError();
        clearGitDataError();
        clearMemberDetails();
    }, [clearUserError, clearGitDataError, clearMemberDetails]);

    // Check if data is ready
    const isDataReady = !!(fetchedUser && memberDetailsData);

    return {
        memberData,
        memberStats,
        repositories: memberDetailsData?.repos || [],
        isLoading,
        error,
        isDataReady,
        retry,
        refetch: fetchMemberDetails,
    };
}
