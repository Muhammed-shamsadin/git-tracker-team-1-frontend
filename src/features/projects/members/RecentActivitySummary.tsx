import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

export function RecentActivitySummary() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity Summary
                </CardTitle>
                <CardDescription>
                    Latest contributions to this project
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                        <p className="font-medium">Commits This Week</p>
                        <p className="text-muted-foreground text-sm">
                            Across all repositories
                        </p>
                    </div>
                    <div className="font-bold text-2xl">8</div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                        <p className="font-medium">Files Modified</p>
                        <p className="text-muted-foreground text-sm">
                            In recent commits
                        </p>
                    </div>
                    <div className="font-bold text-2xl">23</div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                        <p className="font-medium">Average Commit Size</p>
                        <p className="text-muted-foreground text-sm">
                            Lines changed per commit
                        </p>
                    </div>
                    <div className="font-bold text-2xl">156</div>
                </div>
            </CardContent>
        </Card>
    );
}
