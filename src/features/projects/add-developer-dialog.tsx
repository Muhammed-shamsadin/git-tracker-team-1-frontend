"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MemberType } from "@/types/Project";

type Developer = {
    _id: string;
    fullName: string;
    email: string;
};

enum DeveloperRole {
    FRONTEND = "frontend",
    BACKEND = "backend",
    FULLSTACK = "fullstack",
    QA = "qa",
    DEVOPS = "devops",
    DESIGNER = "designer",
    DEVELOPER = "developer",
}

interface Props {
    projectId: string | undefined;
}
export function AddDeveloperDialog({ projectId }: Props) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedDevelopers, setSelectedDevelopers] = React.useState<
        Developer[]
    >([]);
    const [isComboboxOpen, setIsComboboxOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState<DeveloperRole>(
        DeveloperRole.DEVELOPER
    );
    const { assignDevelopers, currentProject } = useProjectStore();
    const { developers, fetchDevelopers, isLoading } = useUserStore();

    React.useEffect(() => {
        if (open) {
            fetchDevelopers();
        }
    }, [open, fetchDevelopers]);

    // Get member user_ids from currentProject
    const memberIds = React.useMemo(() => {
        if (!currentProject || !currentProject.members) return [];
        return currentProject.members.map((m: MemberType) => m.userId);
    }, [currentProject]);

    const filteredDevelopers = React.useMemo(() => {
        const query = searchQuery.toLowerCase();
        return developers.filter(
            (dev: Developer) =>
                dev.fullName.toLowerCase().includes(query) ||
                dev.email.toLowerCase().includes(query)
        );
    }, [searchQuery, developers]);

    const handleAddDeveloper = async () => {
        if (!selectedDevelopers.length || !selectedRole || !projectId) return;
        const data = {
            projectId,
            developers: selectedDevelopers.map((dev) => dev._id),
            role: selectedRole,
        };
        console.log("Adding developers:", data);
        try {
            setIsSubmitting(true);
            await assignDevelopers(data);

            const developerNames = selectedDevelopers
                .map((dev) => dev.fullName)
                .join(", ");
            toast.success(
                `Added ${developerNames} as ${selectedRole} to the project`
            );
            setSelectedDevelopers([]);
            setSearchQuery("");
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to add developers. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeveloperToggle = (developer: Developer) => {
        setSelectedDevelopers((prev) => {
            const isSelected = prev.some((dev) => dev._id === developer._id);
            if (isSelected) {
                return prev.filter((dev) => dev._id !== developer._id);
            } else {
                return [...prev, developer];
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Developer</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl tracking-tight">
                        Add Developers to Project
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Search and select developers to add them to this
                        project. You can select multiple developers at once.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Search & Select Developers</Label>
                        {selectedDevelopers.length > 0 && (
                            <div className="flex flex-wrap gap-2 bg-muted/50 p-2 rounded-md">
                                {selectedDevelopers.map((developer) => (
                                    <div
                                        key={developer._id}
                                        className="flex items-center gap-1 bg-primary px-2 py-1 rounded-md text-primary-foreground text-sm"
                                    >
                                        <div className="flex justify-center items-center bg-primary-foreground/20 rounded-full w-4 h-4 text-xs">
                                            {developer.fullName.charAt(0)}
                                        </div>
                                        <span>{developer.fullName}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeveloperToggle(developer)
                                            }
                                            className="hover:bg-primary-foreground/20 ml-1 p-0.5 rounded-full"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Popover
                            open={isComboboxOpen}
                            onOpenChange={setIsComboboxOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={isComboboxOpen}
                                    className="justify-between w-full"
                                >
                                    {selectedDevelopers.length > 0 ? (
                                        <span>
                                            {selectedDevelopers.length}{" "}
                                            developer
                                            {selectedDevelopers.length > 1
                                                ? "s"
                                                : ""}{" "}
                                            selected
                                        </span>
                                    ) : (
                                        "Select developers..."
                                    )}
                                    <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="p-0 w-full"
                                align="start"
                            >
                                <Command>
                                    <CommandInput
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                    />
                                    <CommandEmpty>
                                        No developers found.
                                    </CommandEmpty>
                                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                                        {isLoading ? (
                                            <div className="flex justify-center items-center p-3 text-muted-foreground text-sm">
                                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                Loading...
                                            </div>
                                        ) : (
                                            filteredDevelopers.map(
                                                (developer: Developer) => {
                                                    const isSelected =
                                                        selectedDevelopers.some(
                                                            (dev) =>
                                                                dev._id ===
                                                                developer._id
                                                        );
                                                    const isMember =
                                                        memberIds.includes(
                                                            developer._id
                                                        );
                                                    return (
                                                        <CommandItem
                                                            key={developer._id}
                                                            value={`${developer.fullName} ${developer.email}`}
                                                            onSelect={() => {
                                                                if (!isMember)
                                                                    handleDeveloperToggle(
                                                                        developer
                                                                    );
                                                            }}
                                                            className={cn(
                                                                "cursor-pointer",
                                                                isMember &&
                                                                    "opacity-50 pointer-events-none"
                                                            )}
                                                            disabled={isMember}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 w-4 h-4",
                                                                    isSelected
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8">
                                                                    {developer.fullName.charAt(
                                                                        0
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span>
                                                                        {
                                                                            developer.fullName
                                                                        }
                                                                    </span>
                                                                    <span className="text-muted-foreground text-xs">
                                                                        {
                                                                            developer.email
                                                                        }
                                                                    </span>
                                                                    {isMember && (
                                                                        <span className="text-muted-foreground text-xs">
                                                                            Already
                                                                            a
                                                                            member
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CommandItem>
                                                    );
                                                }
                                            )
                                        )}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={selectedRole}
                            onValueChange={(v) =>
                                setSelectedRole(v as DeveloperRole)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={DeveloperRole.FRONTEND}>
                                    Frontend
                                </SelectItem>
                                <SelectItem value={DeveloperRole.BACKEND}>
                                    Backend
                                </SelectItem>
                                <SelectItem value={DeveloperRole.FULLSTACK}>
                                    Fullstack
                                </SelectItem>
                                <SelectItem value={DeveloperRole.QA}>
                                    QA
                                </SelectItem>
                                <SelectItem value={DeveloperRole.DEVOPS}>
                                    DevOps
                                </SelectItem>
                                <SelectItem value={DeveloperRole.DESIGNER}>
                                    Designer
                                </SelectItem>
                                <SelectItem value={DeveloperRole.DEVELOPER}>
                                    Developer
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleAddDeveloper}
                        disabled={!selectedDevelopers.length || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            `Add ${selectedDevelopers.length} Developer${
                                selectedDevelopers.length > 1 ? "s" : ""
                            } to Project`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
