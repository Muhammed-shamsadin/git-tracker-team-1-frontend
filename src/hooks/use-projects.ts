import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";

/**
 * Hook to automatically fetch projects based on user role
 * - Superadmin: All projects
 * - Client: Their own projects
 * - Developer: Projects they're assigned to
 */
export const useRoleBasedProjects = (page?: number, limit?: number) => {
    const { user } = useAuthStore();
    const {
        projects,
        isLoading,
        error,
        fetchAllProjects,
        fetchClientProjects,
        fetchDeveloperProjects,
    } = useProjectStore();

    useEffect(() => {
        if (!user) return;

        switch (user.userType) {
            case "superadmin":
                fetchAllProjects(page, limit);
                break;
            case "client":
                fetchClientProjects();
                break;
            case "developer":
                fetchDeveloperProjects();
                break;
        }
    }, [user?.userType, page, limit]);

    return {
        projects,
        isLoading,
        error,
        userRole: user?.userType,
    };
};

/**
 * Hook to check if current user can perform actions on a project
 */
export const useProjectPermissions = (project?: any) => {
    const { user } = useAuthStore();

    const canEdit = () => {
        if (!user || !project) return false;

        if (user.userType === "superadmin") return true;
        if (user.userType === "client" && project.clientId === user._id)
            return true;

        return false;
    };

    const canDelete = () => {
        if (!user || !project) return false;

        if (user.userType === "superadmin") return true;
        if (user.userType === "client" && project.clientId === user._id)
            return true;

        return false;
    };

    const canManageMembers = () => {
        if (!user || !project) return false;

        if (user.userType === "superadmin") return true;
        if (user.userType === "client" && project.clientId === user._id)
            return true;

        return false;
    };

    const canView = () => {
        if (!user || !project) return false;

        if (user.userType === "superadmin") return true;
        if (user.userType === "client" && project.clientId === user._id)
            return true;

        // Check if developer is assigned to project
        if (user.userType === "developer") {
            return (
                project.projectDevelopers?.some(
                    (dev: any) =>
                        dev.developerId === user._id || dev === user._id
                ) || false
            );
        }

        return false;
    };

    return {
        canEdit: canEdit(),
        canDelete: canDelete(),
        canManageMembers: canManageMembers(),
        canView: canView(),
        isOwner: user?.userType === "client" && project?.clientId === user._id,
        isMember:
            user?.userType === "developer" &&
            project?.projectDevelopers?.some(
                (dev: any) => dev.developerId === user._id || dev === user._id
            ),
    };
};
