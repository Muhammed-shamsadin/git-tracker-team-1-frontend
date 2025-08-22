"use client";

import { useEffect, useState } from "react";
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
import { Plus, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";
import { CreateProjectData, CreateProjectSchema } from "@/types/Project";

export function ProjectCreateDialog() {
    const { createProject, isLoading } = useProjectStore();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        watch,
    } = useForm<CreateProjectData>({
        resolver: zodResolver(CreateProjectSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            description: "",
            status: "active",
            repoLimit: 10,
        },
    });

    const currentStatus = watch("status");

    const onSubmit = async (data: CreateProjectData) => {
        try {
            const newProject = await createProject(data);
            if (newProject) {
                setOpen(false);
                toast.success(
                    `Project ${newProject.name} was created successfully!`
                );
                window.location.reload();
            }
        } catch (error: any) {
            toast.error(
                error?.message || "Failed to create project. Please try again."
            );
        }
    };

    const statusVariant =
        {
            active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            archived:
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
            completed:
                "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        }[currentStatus as "active" | "archived" | "completed"] ||
        "bg-gray-100 text-gray-800";

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);
    return (
        <>
            <Button className="gap-2" onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <DialogHeader>
                            <DialogTitle className="font-bold text-2xl tracking-tight">
                                Create New Project
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Set up your new project with a name,
                                description, and status.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                {/* Project Name */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="name">
                                            Project Name
                                        </Label>
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
                                {/* Description */}
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
                                {/* Status */}
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
                                            <SelectItem value="completed">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-blue-500 rounded-full w-2 h-2" />
                                                    Completed
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Repo Limit */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="repoLimit">
                                            Repository Limit
                                        </Label>
                                        {errors.repoLimit && (
                                            <span className="flex items-center gap-1 text-destructive text-xs">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                {errors.repoLimit.message}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        id="repoLimit"
                                        type="number"
                                        min={1}
                                        placeholder="Enter repository limit"
                                        className={cn("w-full", {
                                            "border-destructive focus-visible:ring-destructive/50":
                                                errors.repoLimit,
                                        })}
                                        {...register("repoLimit", {
                                            valueAsNumber: true,
                                        })}
                                    />
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
                                disabled={!isValid || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 w-4 h-4" />
                                        Create Project
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
