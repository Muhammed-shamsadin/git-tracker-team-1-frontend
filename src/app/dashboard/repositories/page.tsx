import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Repositories() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Respositories
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your repositories and their settings.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    New Repository
                </Button>
            </div>
        </div>
    );
}
