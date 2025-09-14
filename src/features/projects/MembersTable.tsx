"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Mail, MoreHorizontal, UserX, Settings } from "lucide-react";
import { ProjectDetail } from "@/types/Project";
import { useProjectStore } from "@/stores/projectStore";
import { toast } from "sonner";

interface RemovalState {
    isDialogOpen: boolean;
    memberToRemove: ProjectDetail["members"][0] | null;
    isRemoving: boolean;
}

export function MembersTable({
    members,
    projectId,
}: {
    members: ProjectDetail["members"];
    projectId: string;
}) {
    const { removeDeveloper, isLoading, error, clearError } = useProjectStore();

    const [removalState, setRemovalState] = useState<RemovalState>({
        isDialogOpen: false,
        memberToRemove: null,
        isRemoving: false,
    });

    const handleRemoveClick = (member: ProjectDetail["members"][0]) => {
        setRemovalState({
            isDialogOpen: true,
            memberToRemove: member,
            isRemoving: false,
        });
    };

    const handleRemoveConfirm = async () => {
        if (!removalState.memberToRemove) return;

        setRemovalState((prev) => ({ ...prev, isRemoving: true }));
        clearError();

        try {
            const success = await removeDeveloper({
                projectId,
                developerId: removalState.memberToRemove.userId,
            });

            if (success) {
                toast.success(
                    `${removalState.memberToRemove.name} has been removed from the project successfully.`
                );
                setRemovalState({
                    isDialogOpen: false,
                    memberToRemove: null,
                    isRemoving: false,
                });
            } else {
                toast.error(
                    "Failed to remove member from project. Please try again."
                );
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setRemovalState((prev) => ({ ...prev, isRemoving: false }));
        }
    };

    const handleDialogClose = () => {
        if (!removalState.isRemoving) {
            setRemovalState({
                isDialogOpen: false,
                memberToRemove: null,
                isRemoving: false,
            });
            clearError();
        }
    };

    if (members.length === 0) {
        return (
            <div className="p-4 text-muted-foreground text-center">
                No members found in this project.
            </div>
        );
    }

    // Role color mapping
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

    return (
        <>
            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.userId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {member.name
                                                        .split(" ")
                                                        .map((n) =>
                                                            n[0].toUpperCase()
                                                        )
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    <Link
                                                        href={`/dashboard/projects/${projectId}/members/${member.userId}`}
                                                        className="hover:underline"
                                                    >
                                                        {member.name}
                                                    </Link>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                                    <Mail className="w-3 h-3" />
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                roleVariant[member.role] ||
                                                "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {member.role}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        {member.joinedAt
                                            ? new Date(
                                                  member.joinedAt
                                              ).toLocaleDateString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={
                                                            isLoading ||
                                                            removalState.isRemoving
                                                        }
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            // TODO: Implement role change functionality
                                                            toast.info(
                                                                "Role change functionality coming soon!"
                                                            );
                                                        }}
                                                    >
                                                        <Settings className="mr-2 w-4 h-4" />
                                                        Change Role
                                                    </DropdownMenuItem>
                                                    {member.role !==
                                                        "owner" && (
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() =>
                                                                handleRemoveClick(
                                                                    member
                                                                )
                                                            }
                                                            disabled={
                                                                isLoading ||
                                                                removalState.isRemoving
                                                            }
                                                        >
                                                            <UserX className="mr-2 w-4 h-4" />
                                                            Remove from Project
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Removal Confirmation Dialog */}
            <ConfirmationDialog
                open={removalState.isDialogOpen}
                onOpenChange={handleDialogClose}
                title="Remove Member from Project"
                description={
                    removalState.memberToRemove
                        ? `Are you sure you want to remove ${removalState.memberToRemove.name} from this project? This action cannot be undone. The member will lose access to all project resources and data.`
                        : "Are you sure you want to remove this member?"
                }
                confirmText="Remove Member"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleRemoveConfirm}
                isLoading={removalState.isRemoving}
            />
        </>
    );
}
