"use client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function CommitGraphPlaceholder() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Commit Activity
                </CardTitle>
                <CardDescription>
                    Commit frequency over the last 30 days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center border-2 border-muted-foreground/25 border-dashed rounded-lg h-[200px]">
                    <div className="text-muted-foreground text-center">
                        <TrendingUp className="mx-auto mb-2 w-8 h-8" />
                        <p className="text-sm">Commit graph visualization</p>
                        <p className="text-xs">Chart integration needed</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
