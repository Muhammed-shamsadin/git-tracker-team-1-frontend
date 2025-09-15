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
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
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
    showTimeRangeTabs?: boolean;
}

export function CommitTrendsChart({
    title,
    description,
    data,
    timeRange = "week",
    onTimeRangeChange,
    showTimeRangeTabs = true,
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
                    {showTimeRangeTabs && (
                        <Tabs value={timeRange} onValueChange={(v) => onTimeRangeChange?.(v as TimeRange)}>
                            <TabsList>
                                <TabsTrigger value="week">Week</TabsTrigger>
                                <TabsTrigger value="month">Month</TabsTrigger>
                                <TabsTrigger value="year">Year</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
                </div>
            </CardHeader>
            <CardContent className="px-4">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <AreaChart data={data} margin={{ left: 0, right: 0, bottom: 24 }}>
                        <defs>
                            <linearGradient id="fillCommits" x1="0" y1="0" x2="0" y2="1">
                                {/* Light blue gradient for better contrast in dark mode */}
                                <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            minTickGap={24}
                            padding={{ left: 16, right: 16 }}
                        />
                        <YAxis
                            width={40}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={[0, 'dataMax']}
                        />
                        <Area
                            type="monotone"
                            dataKey="commits"
                            stroke="#60A5FA"
                            strokeWidth={2}
                            fill="url(#fillCommits)"
                            fillOpacity={1}
                            dot={{ r: 3, strokeWidth: 2, fill: "#60A5FA" }}
                            activeDot={{ r: 4 }}
                        />
                        <ChartTooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            content={<ChartTooltipContent nameKey="commits" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default CommitTrendsChart;


