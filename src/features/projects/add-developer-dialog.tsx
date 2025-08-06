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
import api from "@/lib/axios";

type Developer = {
    _id: string;
    fullName: string;
    email: string;
};

interface Props {
    projectId: string;
}

export function AddDeveloperDialog({ projectId }: Props) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedDeveloper, setSelectedDeveloper] =
        React.useState<Developer | null>(null);
    const [isComboboxOpen, setIsComboboxOpen] = React.useState(false);
    const [developers, setDevelopers] = React.useState<Developer[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Fetch real developers
    React.useEffect(() => {
        const fetchDevelopers = async () => {
            setLoading(true);
            try {
                const res = await api.get("/users/developers");
                const devs = res.data?.data || [];
                setDevelopers(devs);
            } catch (err) {
                toast.error("Failed to load developers");
            } finally {
                setLoading(false);
            }
        };

        if (open) fetchDevelopers();
    }, [open]);

    const filteredDevelopers = React.useMemo(() => {
        const query = searchQuery.toLowerCase();
        return developers.filter(
            (dev) =>
                dev.fullName.toLowerCase().includes(query) ||
                dev.email.toLowerCase().includes(query)
        );
    }, [searchQuery, developers]);

    const handleAddDeveloper = async () => {
        if (!selectedDeveloper) return;

        try {
            setIsSubmitting(true);
            await api.patch(`/projects/${projectId}/developers`, {
                developerIds: [selectedDeveloper._id],
                action: "assign",
            });

            toast.success(`Added ${selectedDeveloper.fullName} to the project`);
            setSelectedDeveloper(null);
            setSearchQuery("");
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to add developer. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Developer</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl tracking-tight">
                        Add Developer to Project
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Search for a developer by name or email to add them to
                        this project.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Search Developer</Label>
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
                                    {selectedDeveloper ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-center items-center bg-muted rounded-full w-6 h-6">
                                                {selectedDeveloper.fullName.charAt(
                                                    0
                                                )}
                                            </div>
                                            <span>
                                                {selectedDeveloper.fullName}
                                            </span>
                                            <span className="text-muted-foreground">
                                                ({selectedDeveloper.email})
                                            </span>
                                        </div>
                                    ) : (
                                        "Select developer..."
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
                                        {loading ? (
                                            <div className="flex justify-center items-center p-3 text-muted-foreground text-sm">
                                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                Loading...
                                            </div>
                                        ) : (
                                            filteredDevelopers.map(
                                                (developer) => (
                                                    <CommandItem
                                                        key={developer._id}
                                                        value={`${developer.fullName} ${developer.email}`}
                                                        onSelect={() => {
                                                            setSelectedDeveloper(
                                                                developer
                                                            );
                                                            setIsComboboxOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 w-4 h-4",
                                                                selectedDeveloper?._id ===
                                                                    developer._id
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
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                )
                                            )
                                        )}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
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
                        disabled={!selectedDeveloper || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Add to Project"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
