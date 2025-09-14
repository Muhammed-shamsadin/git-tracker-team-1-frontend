"use client";

import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeRange = "week" | "month" | "year";

export interface CommitPoint {
    date: string;
    commits: number;
}

interface CommitTrendsChartProps {
    title: string;
    description?: string;
    data: CommitPoint[];
    timeRange?: TimeRange;
    onTimeRangeChange?: (range: TimeRange) => void;
}

export function CommitTrendsChart({
    title,
    description,
    data,
    timeRange = "week",
    onTimeRangeChange,
}: CommitTrendsChartProps) {
    const chartConfig = {
        commits: {
            label: "Commits",
            color: "hsl(var(--primary))",
        },
    } as const;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </div>
                    <Tabs value={timeRange} onValueChange={(v) => onTimeRangeChange?.(v as TimeRange)}>
                        <TabsList>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                width={40}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <Line
                                type="monotone"
                                dataKey="commits"
                                stroke="var(--color-commits)"
                                strokeWidth={2}
                                dot={{ r: 3, strokeWidth: 2, fill: "var(--color-commits)" }}
                                activeDot={{ r: 4 }}
                            />
                            <ChartTooltip
                                cursor={{ strokeDasharray: "3 3" }}
                                content={<ChartTooltipContent nameKey="commits" />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default CommitTrendsChart;


