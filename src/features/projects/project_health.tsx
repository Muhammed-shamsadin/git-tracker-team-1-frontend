import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const healthMetrics = [
  {
    name: "Code Coverage",
    value: 85,
    color: "bg-green-500",
  },
  {
    name: "Build Success Rate",
    value: 98,
    color: "bg-green-500",
  },
];

export function ProjectHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {healthMetrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{metric.name}</span>
              <span className="text-sm text-muted-foreground">
                {metric.value}%
              </span>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Security Score</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              A-
            </Badge>
          </div>
          <Progress value={90} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
