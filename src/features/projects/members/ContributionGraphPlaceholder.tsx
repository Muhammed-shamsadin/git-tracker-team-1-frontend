import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Activity } from "lucide-react";

export function ContributionGraphPlaceholder() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Contribution Activity
                </CardTitle>
                <CardDescription>
                    Daily commit activity for this project
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center border-2 border-muted-foreground/25 border-dashed rounded-lg h-[200px]">
                    <div className="text-muted-foreground text-center">
                        <Activity className="mx-auto mb-2 w-8 h-8 animate-spin" />
                        <p className="text-sm">Contribution graph</p>
                        <p className="text-xs">Chart integration needed</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
