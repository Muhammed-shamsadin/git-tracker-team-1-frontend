"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/DataTable";
import { memberColumns } from "./columns";
import { useProjectStore, type Member } from "@/stores/projectStore";
import type {
    StatusConfig,
    RowAction,
    FilterConfig,
} from "@/components/data-table/types";
import { Eye, UserMinus, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import ListSkeleton from "@/components/skeletons/list-page-skeleton";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AddDeveloperDialog } from "@/features/projects/add-developer-dialog";

export default function MembersPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { user } = useAuthStore();
    const {
        members,
        isLoading,
        error,
        fetchProjectMembers,
        removeDeveloper,
        clearMembers,
    } = useProjectStore();

    const [selectedRows, setSelectedRows] = useState<Member[]>([]);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

    // Fetch members on component mount
    useEffect(() => {
        if (projectId) {
            fetchProjectMembers(projectId);
        }

        // Clear members when component unmounts
        return () => {
            clearMembers();
        };
    }, [projectId, fetchProjectMembers, clearMembers]);

    const handleRemoveClick = (member: Member) => {
        setMemberToRemove(member);
        setRemoveDialogOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (memberToRemove && projectId) {
            const success = await removeDeveloper({
                projectId,
                developerId: memberToRemove.user_id,
            });
            if (success) {
                toast.success(`Removed ${memberToRemove.name} from project`);
                // Refresh the members list
                fetchProjectMembers(projectId);
            } else {
                toast.error("Failed to remove member from project");
            }
            setMemberToRemove(null);
            setRemoveDialogOpen(false);
        }
    };

    // Helper function to check permissions
    const canRemoveMember = (member: Member) => {
        if (!user) return false;
        if (user.userType === "superadmin") return true;
        // Clients can remove members from their own projects
        if (user.userType === "client") return true;
        return false;
    };

    const canViewMember = () => {
        return true; // Everyone can view member details
    };

    // Create row actions based on permissions
    const rowActions: RowAction<Member>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View Profile",
            onClick: (member) => {
                router.push(
                    `/dashboard/projects/${projectId}/members/${member.user_id}`
                );
            },
            visible: () => canViewMember(),
        },
        {
            icon: <MessageCircle className="w-4 h-4" />,
            label: "Contact",
            onClick: (member) => {
                // Open email client
                window.location.href = `mailto:${member.email}`;
            },
        },
        {
            icon: <UserMinus className="w-4 h-4" />,
            label: "Remove from Project",
            variant: "destructive",
            onClick: handleRemoveClick,
            visible: (member) => canRemoveMember(member),
        },
    ];

    // Role color mapping for consistency with MembersTable
    const roleVariant: Record<string, string> = {
        owner: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        frontend:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        backend:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        fullstack:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        qa: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
        devops: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        designer:
            "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
        developer:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    };

    const statusConfig: StatusConfig = {
        owner: { icon: "�", label: "Owner", color: "yellow" },
        frontend: { icon: "🎨", label: "Frontend", color: "blue" },
        backend: { icon: "⚙️", label: "Backend", color: "purple" },
        fullstack: { icon: "🚀", label: "Fullstack", color: "green" },
        qa: { icon: "�", label: "QA", color: "pink" },
        devops: { icon: "🛠️", label: "DevOps", color: "orange" },
        designer: { icon: "🎭", label: "Designer", color: "teal" },
        developer: { icon: "👨‍💻", label: "Developer", color: "gray" },
    };

    const filters: FilterConfig[] = [
        {
            key: "role",
            label: "Role",
            type: "select",
            options: [
                { label: "Owner", value: "owner" },
                { label: "Frontend", value: "frontend" },
                { label: "Backend", value: "backend" },
                { label: "Fullstack", value: "fullstack" },
                { label: "QA", value: "qa" },
                { label: "DevOps", value: "devops" },
                { label: "Designer", value: "designer" },
                { label: "Developer", value: "developer" },
            ],
        },
    ];

    const handleRowSelectionChange = useCallback((rows: Member[]) => {
        setSelectedRows(rows);
    }, []);

    // Show bulk actions only for admins and clients
    const canBulkManage =
        user && (user.userType === "client" || user.userType === "superadmin");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Project Members
                    </h1>
                    <p className="text-muted-foreground">
                        {user?.userType === "superadmin" &&
                            "View and manage all project members"}
                        {user?.userType === "client" &&
                            "Manage your project team members"}
                        {user?.userType === "developer" &&
                            "View project team members"}
                    </p>
                </div>
                <AddDeveloperDialog projectId={projectId} />
            </div>

            {/* Confirmation Dialog for Remove */}
            <ConfirmationDialog
                open={removeDialogOpen}
                onOpenChange={setRemoveDialogOpen}
                title="Remove Member"
                description={`Are you sure you want to remove "${memberToRemove?.name}" from this project? They will lose access to project resources.`}
                onConfirm={handleConfirmRemove}
                confirmText="Remove"
                variant="destructive"
            />

            {/* Loading/Error States */}
            {isLoading && <ListSkeleton />}
            {error && (
                <div className="py-4 text-red-500 text-center">{error}</div>
            )}

            {/* Data Table */}
            {!isLoading && !error && (
                <DataTable
                    data={members}
                    columns={memberColumns(projectId)}
                    rowActions={rowActions}
                    searchableFields={["name", "email"]}
                    filters={filters}
                    statusConfig={statusConfig}
                    enableRowSelection={!!canBulkManage}
                    onRowSelectionChange={handleRowSelectionChange}
                    pageSize={10}
                    rowIdAccessor="user_id"
                    initialSort={[{ id: "joined_at", desc: true }]}
                />
            )}

            {/* Empty State */}
            {!isLoading && !error && members.length === 0 && (
                <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                        No members found for this project.
                    </p>
                </div>
            )}
        </div>
    );
}
