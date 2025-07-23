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
import { Plus, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

// Mock data - replace with actual API call
type Developer = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
};

// Mock developers data - replace with API call
const mockDevelopers: Developer[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com" },
    { id: "4", name: "Alice Williams", email: "alice@example.com" },
];

export function AddDeveloperDialog() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedDeveloper, setSelectedDeveloper] =
        React.useState<Developer | null>(null);
    const [isComboboxOpen, setIsComboboxOpen] = React.useState(false);

    // Filter developers based on search query (name or email)
    const filteredDevelopers = React.useMemo(() => {
        if (!searchQuery) return mockDevelopers;
        const query = searchQuery.toLowerCase();
        return mockDevelopers.filter(
            (dev) =>
                dev.name.toLowerCase().includes(query) ||
                dev.email.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleAddDeveloper = async () => {
        if (!selectedDeveloper) return;

        try {
            setIsSubmitting(true);

            // TODO: Replace with actual API endpoint to add developer to project
            // const response = await fetch(`/api/projects/${projectId}/developers`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         developerId: selectedDeveloper.id,
            //         role: 'developer', // or get role from a role selector
            //     }),
            // });

            // if (!response.ok) {
            //     throw new Error('Failed to add developer to project');
            // }

            toast.success(`Added ${selectedDeveloper.name} to the project`);
            setSelectedDeveloper(null);
            setSearchQuery("");
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error adding developer:", error);
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
                    <div className="space-y-4">
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
                                                    {selectedDeveloper.name.charAt(
                                                        0
                                                    )}
                                                </div>
                                                <span>
                                                    {selectedDeveloper.name}
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
                                            {filteredDevelopers.map(
                                                (developer) => (
                                                    <CommandItem
                                                        key={developer.id}
                                                        value={`${developer.name} ${developer.email}`}
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
                                                                selectedDeveloper?.id ===
                                                                    developer.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8">
                                                                {developer.name.charAt(
                                                                    0
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span>
                                                                    {
                                                                        developer.name
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
                                            )}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Role selection can be added here */}
                        {/* <div className="space-y-2">
                            <Label>Role</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="developer">Developer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}
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
