"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Repository } from "@/types/Repository";
import { useEffect, useState } from "react";

interface CommitActivityChartProps {
    repository: Repository;
}

interface CommitActivityData {
    date: string;
    count: number;
}

export function CommitActivityChart({ repository }: CommitActivityChartProps) {
    const [chartData, setChartData] = useState<CommitActivityData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // This would fetch real commit activity data in a production app
    useEffect(() => {
        if (repository._id) {
            setIsLoading(true);
            // Mock data for now, but in a real app, you would call an API
            const mockData = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                return {
                    date: date.toISOString().split("T")[0],
                    count: Math.floor(Math.random() * 10),
                };
            });

            // Simulate API delay
            setTimeout(() => {
                setChartData(mockData);
                setIsLoading(false);
            }, 500);
        }
    }, [repository._id]);

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
                {isLoading ? (
                    <div className="flex justify-center items-center h-[200px]">
                        <p className="text-muted-foreground">
                            Loading chart data...
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-center items-center border-2 border-muted-foreground/25 border-dashed rounded-lg h-[200px]">
                        <div className="text-muted-foreground text-center">
                            <TrendingUp className="mx-auto mb-2 w-8 h-8" />
                            <p className="text-sm">Commit activity chart</p>
                            <p className="text-xs">
                                {chartData.length > 0
                                    ? `Data ready for visualization (${chartData.length} days)`
                                    : "Chart integration needed"}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
