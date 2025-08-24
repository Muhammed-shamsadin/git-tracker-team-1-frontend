import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRepositoryStore } from "@/stores/repositoryStore";

/**
 * Hook to automatically fetch repositories based on user role
 * - Superadmin: All repositories (paginated)
 * - Client: Repositories for their projects
 * - Developer: Repositories they own or contribute to
 */
export const useRoleBasedRepositories = (page?: number, limit?: number) => {
    const { user } = useAuthStore();
    const {
        repositories,
        paginatedRepositories,
        isLoading,
        error,
        fetchAllRepositories,
        fetchDeveloperRepositories,
    } = useRepositoryStore();

    useEffect(() => {
        if (!user) return;

        switch (user.userType) {
            case "superadmin":
                fetchAllRepositories(page, limit);
                break;
            case "client":
                fetchAllRepositories();
                break;
            case "developer":
                fetchDeveloperRepositories();
                break;
        }
    }, [user?.userType, page, limit]);

    return {
        repositories,
        paginatedRepositories,
        isLoading,
        error,
        userRole: user?.userType,
    };
};
