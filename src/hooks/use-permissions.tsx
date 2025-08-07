// TODO: Uncomment and update the use permission implementation when the API is ready

// import { useAuthStore } from "@/stores/authStore";

// export type UserRole = "superadmin" | "client" | "developer";

// export interface PermissionConfig {
//     roles: UserRole[];
//     fallback?: React.ReactNode;
// }

// export const usePermissions = () => {
//     const { user } = useAuthStore();
//     const userRole = user?.userType as UserRole;

//     const hasRole = (allowedRoles: UserRole[]): boolean => {
//         if (!userRole || !allowedRoles.length) return false;
//         return allowedRoles.includes(userRole);
//     };

//     const canCreateProject = (): boolean => {
//         return hasRole(["superadmin", "client"]);
//     };

//     const canCreateRepository = (): boolean => {
//         return hasRole(["superadmin", "developer"]);
//     };

//     const canCreateUser = (): boolean => {
//         return hasRole(["superadmin"]);
//     };

//     const canDeleteProject = (projectOwnerId?: string): boolean => {
//         if (hasRole(["superadmin"])) return true;
//         if (hasRole(["client"]) && projectOwnerId === user?._id) return true;
//         return false;
//     };

//     const canDeleteRepository = (repositoryOwnerId?: string): boolean => {
//         if (hasRole(["superadmin"])) return true;
//         if (hasRole(["developer"]) && repositoryOwnerId === user?._id)
//             return true;
//         return false;
//     };

//     const canViewAllProjects = (): boolean => {
//         return hasRole(["superadmin"]);
//     };

//     const canViewAllRepositories = (): boolean => {
//         return hasRole(["superadmin"]);
//     };

//     const canViewAllUsers = (): boolean => {
//         return hasRole(["superadmin"]);
//     };

//     const canManageProjectMembers = (projectOwnerId?: string): boolean => {
//         if (hasRole(["superadmin"])) return true;
//         if (hasRole(["client"]) && projectOwnerId === user?._id) return true;
//         return false;
//     };

//     const canViewClientsList = (): boolean => {
//         return hasRole(["superadmin", "developer"]);
//     };

//     const canViewDevelopersList = (): boolean => {
//         return hasRole(["superadmin", "client"]);
//     };

//     const canViewAnalytics = (): boolean => {
//         return hasRole(["superadmin", "client", "developer"]);
//     };

//     const canViewFullAnalytics = (): boolean => {
//         return hasRole(["superadmin"]);
//     };

//     return {
//         userRole,
//         hasRole,
//         canCreateProject,
//         canCreateRepository,
//         canCreateUser,
//         canDeleteProject,
//         canDeleteRepository,
//         canViewAllProjects,
//         canViewAllRepositories,
//         canViewAllUsers,
//         canManageProjectMembers,
//         canViewClientsList,
//         canViewDevelopersList,
//         canViewAnalytics,
//         canViewFullAnalytics,
//     };
// };

// // Higher-order component for role-based rendering
// export const withPermission = (
//     Component: React.ComponentType<any>,
//     config: PermissionConfig
// ) => {
//     return function PermissionWrapper(props: any) {
//         const { hasRole } = usePermissions();

//         if (!hasRole(config.roles)) {
//             return config.fallback || null;
//         }

//         return <Component {...props} />;
//     };
// };

// // Component for conditional rendering based on permissions
// export const PermissionGate: React.FC<{
//     roles: UserRole[];
//     fallback?: React.ReactNode;
//     children: React.ReactNode;
// }> = ({ roles, fallback, children }) => {
//     const { hasRole } = usePermissions();

//     if (!hasRole(roles)) {
//         return fallback || null;
//     }

//     return <>{children}</>;
// };
