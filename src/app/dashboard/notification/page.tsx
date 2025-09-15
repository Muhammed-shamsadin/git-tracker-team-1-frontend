import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Bell,
    Search,
    CheckCheck,
    Trash2,
    GitCommit,
    Users,
    AlertTriangle,
    MessageSquare,
    Settings,
} from "lucide-react";

// Mock data
const notifications = [
    {
        id: "n1",
        type: "commit",
        title: "New commit in git-tracker-backend",
        message: "John Doe pushed 3 commits to main branch",
        read: false,
        created_at: "2025-08-03T10:30:00Z",
        related_entity_id: "c1",
        related_entity_type: "commit",
        author: {
            name: "John Doe",
            avatar: "/placeholder.svg?height=32&width=32",
        },
    },
    {
        id: "n2",
        type: "assignment",
        title: "You've been added to E-commerce Platform",
        message:
            "Jane Smith added you as a member to the E-commerce Platform project",
        read: false,
        created_at: "2025-08-03T08:15:00Z",
        related_entity_id: "p2345678-9012-3456-7890-123456789012",
        related_entity_type: "project",
        author: {
            name: "Jane Smith",
            avatar: "/placeholder.svg?height=32&width=32",
        },
    },
    {
        id: "n3",
        type: "comment",
        title: "New comment on your commit",
        message: "Mike Brown commented on your commit in git-tracker-frontend",
        read: true,
        created_at: "2025-08-02T16:45:00Z",
        related_entity_id: "c2",
        related_entity_type: "commit",
        author: {
            name: "Mike Brown",
            avatar: "/placeholder.svg?height=32&width=32",
        },
    },
    {
        id: "n4",
        type: "alert",
        title: "Repository sync failed",
        message:
            "Failed to sync git-tracker-mobile repository. Please check your connection.",
        read: true,
        created_at: "2025-08-02T14:20:00Z",
        related_entity_id: "r3",
        related_entity_type: "repository",
        author: {
            name: "System",
            avatar: null,
        },
    },
    {
        id: "n5",
        type: "assignment",
        title: "New team member joined",
        message:
            "Sarah Wilson has joined the Git Tracker project as a Frontend Developer",
        read: true,
        created_at: "2025-08-01T11:30:00Z",
        related_entity_id: "p1234567-8901-2345-6789-012345678901",
        related_entity_type: "project",
        author: {
            name: "Admin",
            avatar: null,
        },
    },
    {
        id: "n6",
        type: "comment",
        title: "Code review requested",
        message:
            "John Doe requested a code review for pull request #42 in git-tracker-backend",
        read: true,
        created_at: "2025-07-31T09:15:00Z",
        related_entity_id: "pr42",
        related_entity_type: "pull_request",
        author: {
            name: "John Doe",
            avatar: "/placeholder.svg?height=32&width=32",
        },
    },
];

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "commit":
            return <GitCommit className="w-4 h-4 text-blue-500" />;
        case "assignment":
            return <Users className="w-4 h-4 text-green-500" />;
        case "comment":
            return <MessageSquare className="w-4 h-4 text-purple-500" />;
        case "alert":
            return <AlertTriangle className="w-4 h-4 text-orange-500" />;
        default:
            return <Bell className="w-4 h-4 text-gray-500" />;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case "commit":
            return "border-l-blue-500";
        case "assignment":
            return "border-l-green-500";
        case "comment":
            return "border-l-purple-500";
        case "alert":
            return "border-l-orange-500";
        default:
            return "border-l-gray-500";
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
};

export default function NotificationsPage() {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-muted-foreground">
                        Stay updated with your projects and team activities
                        {unreadCount > 0 && (
                            <span className="ml-2">
                                •{" "}
                                <span className="font-medium text-blue-600">
                                    {unreadCount} unread
                                </span>
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <CheckCheck className="mr-2 w-4 h-4" />
                        Mark All Read
                    </Button>
                    <Button variant="outline">
                        <Settings className="mr-2 w-4 h-4" />
                        Settings
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                    <Input
                        placeholder="Search notifications..."
                        className="pl-10"
                    />
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="commit">Commits</SelectItem>
                        <SelectItem value="assignment">Assignments</SelectItem>
                        <SelectItem value="comment">Comments</SelectItem>
                        <SelectItem value="alert">Alerts</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Notifications List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        All Notifications
                    </CardTitle>
                    <CardDescription>
                        Recent activity and updates from your projects
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-muted/50 transition-colors border-l-4 ${getNotificationColor(
                                    notification.type
                                )} ${
                                    !notification.read
                                        ? "bg-blue-50/50 dark:bg-blue-950/20"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4
                                                        className={`font-medium ${
                                                            !notification.read
                                                                ? "text-foreground"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <div className="bg-blue-500 rounded-full w-2 h-2"></div>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-muted-foreground text-sm">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    {notification.author
                                                        .avatar ? (
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-5 h-5">
                                                                <AvatarImage
                                                                    src={
                                                                        notification
                                                                            .author
                                                                            .avatar ||
                                                                        "/placeholder.svg"
                                                                    }
                                                                />
                                                                <AvatarFallback className="text-xs">
                                                                    {
                                                                        notification
                                                                            .author
                                                                            .name[0]
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-muted-foreground text-xs">
                                                                {
                                                                    notification
                                                                        .author
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">
                                                            {
                                                                notification
                                                                    .author.name
                                                            }
                                                        </span>
                                                    )}
                                                    <span className="text-muted-foreground text-xs">
                                                        {formatTimeAgo(
                                                            notification.created_at
                                                        )}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {notification.type}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <CheckCheck className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Load More */}
            <div className="flex justify-center">
                <Button variant="outline">Load More Notifications</Button>
            </div>
        </div>
    );
}
