import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function QuickActionsMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Quick Actions
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem>New Project</DropdownMenuItem>
                <DropdownMenuItem>New Repository</DropdownMenuItem>
                <DropdownMenuItem>Add Developer</DropdownMenuItem>
                <DropdownMenuItem>Generate Report</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
