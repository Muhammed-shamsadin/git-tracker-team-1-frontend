import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Users, AlertCircle, Clock } from "lucide-react";

const stats = [
  {
    title: "Repositories",
    value: "3",
    icon: GitBranch,
  },
  {
    title: "Team Members",
    value: "3",
    icon: Users,
  },
  {
    title: "Open Issues",
    value: "12",
    icon: AlertCircle,
  },
  {
    title: "Last Updated",
    value: "2h ago",
    icon: Clock,
  },
];

export function ProjectStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
