"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCog, AlertTriangle, CheckCircle } from "lucide-react";
import { ProjectDetail } from "@/types/Project";
import { useProjectStore } from "@/stores/projectStore";
import { toast } from "sonner";

interface UpdateDeveloperRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: ProjectDetail["members"][0] | null;
    projectId: string;
}

const ROLE_OPTIONS = [
    {
        value: "frontend",
        label: "Frontend Developer",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
        value: "backend",
        label: "Backend Developer",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
        value: "fullstack",
        label: "Fullstack Developer",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    {
        value: "qa",
        label: "QA Engineer",
        color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    },
    {
        value: "devops",
        label: "DevOps Engineer",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    },
    {
        value: "designer",
        label: "UI/UX Designer",
        color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    },
    {
        value: "developer",
        label: "Developer",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    },
];

export function UpdateDeveloperRoleDialog({
    open,
    onOpenChange,
    member,
    projectId,
}: UpdateDeveloperRoleDialogProps) {
    const { updateDeveloperRole, isLoading, error, clearError } =
        useProjectStore();
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Reset form when dialog opens/closes or member changes
    useEffect(() => {
        if (open && member) {
            setSelectedRole(member.role);
            clearError();
        } else if (!open) {
            setSelectedRole("");
            setIsUpdating(false);
            clearError();
        }
    }, [open, member, clearError]);

    const handleUpdateRole = async () => {
        if (!member || !selectedRole || selectedRole === member.role) {
            return;
        }

        setIsUpdating(true);
        clearError();

        try {
            const result = await updateDeveloperRole({
                projectId,
                developerId: member.userId,
                role: selectedRole,
            });

            if (result) {
                const roleLabel =
                    ROLE_OPTIONS.find((role) => role.value === selectedRole)
                        ?.label || selectedRole;
                toast.success(
                    `${member.name}'s role has been updated to ${roleLabel} successfully.`
                );
                onOpenChange(false);
            } else {
                toast.error("Failed to update member role. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        if (!isUpdating) {
            onOpenChange(false);
        }
    };

    const currentRoleOption = ROLE_OPTIONS.find(
        (role) => role.value === member?.role
    );
    const selectedRoleOption = ROLE_OPTIONS.find(
        (role) => role.value === selectedRole
    );
    const hasRoleChanged = selectedRole && selectedRole !== member?.role;

    if (!member) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <UserCog className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="font-semibold text-lg">
                                Update Developer Role
                            </DialogTitle>
                            <DialogDescription className="text-left">
                                Change the role for this project member
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Member Information */}
                    <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-lg">
                        <Avatar>
                            <AvatarFallback>
                                {member.name
                                    .split(" ")
                                    .map((n) => n[0].toUpperCase())
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-muted-foreground text-sm">
                                {member.email}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="mb-1 text-muted-foreground text-xs">
                                Current Role
                            </p>
                            <Badge
                                className={
                                    currentRoleOption?.color ||
                                    "bg-gray-100 text-gray-800"
                                }
                            >
                                {currentRoleOption?.label || member.role}
                            </Badge>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="w-4 h-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="font-medium text-sm">
                            Select New Role
                        </label>
                        <Select
                            value={selectedRole}
                            onValueChange={setSelectedRole}
                            disabled={isUpdating || isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a role..." />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLE_OPTIONS.map((role) => (
                                    <SelectItem
                                        key={role.value}
                                        value={role.value}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={role.color}
                                                variant="secondary"
                                            >
                                                {role.label}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Change Preview */}
                    {hasRoleChanged && (
                        <div className="bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-800 dark:text-green-400 text-sm">
                                    Role Change Preview
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Badge className={currentRoleOption?.color}>
                                    {currentRoleOption?.label}
                                </Badge>
                                <span className="text-muted-foreground">→</span>
                                <Badge className={selectedRoleOption?.color}>
                                    {selectedRoleOption?.label}
                                </Badge>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isUpdating || isLoading}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleUpdateRole}
                        disabled={
                            isUpdating ||
                            isLoading ||
                            !selectedRole ||
                            selectedRole === member.role
                        }
                        className="w-full sm:w-auto"
                    >
                        {isUpdating || isLoading ? (
                            <>
                                <span className="mr-2 w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Role"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
