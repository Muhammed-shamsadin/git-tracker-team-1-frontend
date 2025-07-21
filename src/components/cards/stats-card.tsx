import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import StatsCardProps from "@/types/ui-types";

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="font-medium text-sm">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="font-bold text-2xl">{value}</div>
                {change && (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        {change.type === "increase" ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span
                            className={
                                change.type === "increase"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }
                        >
                            {change.value}%
                        </span>
                        <span>from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
