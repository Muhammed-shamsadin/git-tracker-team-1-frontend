"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Settings, Trash2, Loader2, AlertCircle } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
    Project,
    UpdateProjectSchema,
    UpdateProjectData,
} from "@/types/Project";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/projectStore";

interface ProjectSettingsDialogProps {
    project: Project;
}

export function ProjectSettingsDialog({ project }: ProjectSettingsDialogProps) {
    const router = useRouter();
    const { updateProject, deleteProject, isLoading } = useProjectStore();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        watch,
    } = useForm<UpdateProjectData>({
        resolver: zodResolver(UpdateProjectSchema),
        mode: "onChange",
        defaultValues: {
            name: project.name,
            description: project.description || "",
            status: project.status,
        },
    });

    const currentStatus = watch("status");

    const onSubmit = async (data: UpdateProjectData) => {
        try {
            await updateProject(project._id, data);
            toast.success("Project settings updated successfully");
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error updating project settings:", error);
            toast.error("Failed to update project settings. Please try again.");
        }
    };

    const onDelete = async () => {
        try {
            await deleteProject(project._id);
            toast.success(`Project ${project.name} was deleted successfully`);
            router.push("/dashboard/projects");
            router.refresh();
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project. Please try again.");
            throw error;
        }
    };

    React.useEffect(() => {
        if (open) {
            reset({
                name: project.name,
                description: project.description || "",
                status: project.status,
            });
        }
    }, [open, project, reset]);

    const statusVariant =
        {
            active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            archived:
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
            deleted:
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        }[currentStatus as "active" | "archived" | "deleted"] ||
        "bg-gray-100 text-gray-800";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Settings
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-2xl tracking-tight">
                            Project Settings
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Manage your project settings and configurations
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="name">Project Name</Label>
                                    {errors.name && (
                                        <span className="flex items-center gap-1 text-destructive text-xs">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.name.message}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    id="name"
                                    placeholder="Enter project name"
                                    className={cn("w-full", {
                                        "border-destructive focus-visible:ring-destructive/50":
                                            errors.name,
                                    })}
                                    {...register("name")}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    {errors.description && (
                                        <span className="flex items-center gap-1 text-destructive text-xs">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.description.message}
                                        </span>
                                    )}
                                </div>
                                <Textarea
                                    id="description"
                                    placeholder="Enter project description"
                                    rows={4}
                                    className={cn("w-full min-h-[120px]", {
                                        "border-destructive focus-visible:ring-destructive/50":
                                            errors.description,
                                    })}
                                    {...register("description")}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Status</Label>
                                    {errors.status && (
                                        <span className="flex items-center gap-1 text-destructive text-xs">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.status.message}
                                        </span>
                                    )}
                                </div>
                                <Select
                                    value={currentStatus}
                                    onValueChange={(value) =>
                                        setValue("status", value as any)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex h-2 w-2 rounded-full ${statusVariant}`}
                                            />
                                            <SelectValue placeholder="Select status" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-green-500 rounded-full w-2 h-2" />
                                                Active
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-gray-400 rounded-full w-2 h-2" />
                                                Archived
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="deleted">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-red-500 rounded-full w-2 h-2" />
                                                Deleted
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-2 font-medium text-destructive text-sm">
                                        Danger Zone
                                    </h4>
                                    <p className="mb-4 text-muted-foreground text-sm">
                                        Once you delete a project, there is no
                                        going back. Please be certain.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        type="button"
                                        onClick={() =>
                                            setDeleteDialogOpen(true)
                                        }
                                        className="w-full sm:w-auto"
                                    >
                                        <Trash2 className="mr-2 w-4 h-4" />
                                        Delete Project
                                    </Button>

                                    <ConfirmationDialog
                                        open={deleteDialogOpen}
                                        onOpenChange={setDeleteDialogOpen}
                                        title="Delete Project"
                                        description="Are you sure you want to delete this project? This action cannot be undone."
                                        confirmText="Delete Project"
                                        variant="destructive"
                                        onConfirm={onDelete}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !isValid}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
