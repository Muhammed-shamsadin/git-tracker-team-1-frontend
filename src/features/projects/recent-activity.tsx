import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activities = [
  {
    user: "John Doe",
    action: "pushed to main branch",
    time: "2h ago",
    type: "commit",
    initials: "JD",
  },
  {
    user: "Jane Smith",
    action: "opened PR #142",
    time: "4h ago",
    type: "pr",
    initials: "JS",
  },
  {
    user: "Mike Johnson",
    action: "reported issue #89",
    time: "1d ago",
    type: "issue",
    initials: "MJ",
  },
  {
    user: "Deployment",
    action: "to production successful",
    time: "2d ago",
    type: "deployment",
    initials: "D",
  },
];

const getActivityColor = (type: string) => {
  switch (type) {
    case "commit":
      return "bg-green-100 text-green-800";
    case "pr":
      return "bg-blue-100 text-blue-800";
    case "issue":
      return "bg-orange-100 text-orange-800";
    case "deployment":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  getActivityColor(activity.type)
                    .replace("text-", "bg-")
                    .split(" ")[0]
                }`}
              />
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
