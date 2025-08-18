import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Mail,
    MapPin,
    Calendar,
    Activity,
    GitCommit,
    TrendingUp,
    Clock,
    FileText,
    GitBranch,
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with API calls
const memberData = {
    user_id: "u1",
    name: "John Doe",
    email: "john@example.com",
    role: "owner",
    avatar: "/placeholder.svg?height=80&width=80",
    joined_at: "2025-08-01T10:00:00Z",
    last_active: "2 hours ago",
    location: "San Francisco, CA",
    bio: "Full-stack developer with 8+ years of experience in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
    total_commits: 127,
    total_repositories: 3,
    lines_added: 12450,
    lines_removed: 3200,
};

const projectData = {
    id: "p1234567-8901-2345-6789-012345678901",
    name: "Git Tracker",
};

const memberCommits = [
    {
        id: "c1",
        message: "Added user authentication system with JWT tokens",
        repository: "git-tracker-backend",
        branch: "main",
        timestamp: "2025-08-03T10:30:00Z",
        files_changed: 8,
        lines_added: 245,
        lines_removed: 12,
    },
    {
        id: "c2",
        message: "Updated dashboard UI components and responsive design",
        repository: "git-tracker-frontend",
        branch: "feature/dashboard-update",
        timestamp: "2025-08-03T08:15:00Z",
        files_changed: 12,
        lines_added: 189,
        lines_removed: 45,
    },
    {
        id: "c3",
        message: "Fixed database connection pooling issues",
        repository: "git-tracker-backend",
        branch: "bugfix/db-connection",
        timestamp: "2025-08-02T16:45:00Z",
        files_changed: 3,
        lines_added: 67,
        lines_removed: 23,
    },
    {
        id: "c4",
        message: "Implemented real-time notifications system",
        repository: "git-tracker-backend",
        branch: "feature/notifications",
        timestamp: "2025-08-02T14:20:00Z",
        files_changed: 15,
        lines_added: 423,
        lines_removed: 8,
    },
    {
        id: "c5",
        message: "Added unit tests for authentication module",
        repository: "git-tracker-backend",
        branch: "main",
        timestamp: "2025-08-01T11:30:00Z",
        files_changed: 6,
        lines_added: 156,
        lines_removed: 0,
    },
];

const contributionStats = [
    { date: "2025-08-01", commits: 3 },
    { date: "2025-08-02", commits: 5 },
    { date: "2025-08-03", commits: 2 },
    { date: "2025-08-04", commits: 0 },
    { date: "2025-08-05", commits: 4 },
    { date: "2025-08-06", commits: 1 },
    { date: "2025-08-07", commits: 3 },
];

const repositoryContributions = [
    {
        repository: "git-tracker-backend",
        commits: 78,
        lines_added: 8450,
        lines_removed: 2100,
        last_commit: "2 hours ago",
    },
    {
        repository: "git-tracker-frontend",
        commits: 34,
        lines_added: 2890,
        lines_removed: 890,
        last_commit: "1 day ago",
    },
    {
        repository: "git-tracker-mobile",
        commits: 15,
        lines_added: 1110,
        lines_removed: 210,
        last_commit: "3 days ago",
    },
];

export default function MemberDetailsPage({ params }: any) {
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects`}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to {projectData.name}
                    </Link>
                </Button>
            </div>

            {/* Member Header */}
            <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                    <AvatarImage
                        src={memberData.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-lg">
                        {memberData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="font-bold text-3xl tracking-tight">
                            {memberData.name}
                        </h1>
                        {/* <Badge
                            variant={
                                memberData.role === "developer"
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            {memberData.role}
                        </Badge> */}
                    </div>
                    <p className="max-w-2xl text-muted-foreground">
                        {memberData.bio}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {memberData.email}
                        </div>

                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Joined{" "}
                            {new Date(
                                memberData.joined_at
                            ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Active {memberData.last_active}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {memberData.skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commits">Recent Commits</TabsTrigger>
                    <TabsTrigger value="repositories">
                        Repository Contributions
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Quick Stats */}
                    <div className="gap-4 grid md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                <CardTitle className="font-medium text-sm">
                                    Total Commits
                                </CardTitle>
                                <GitCommit className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-bold text-2xl">
                                    {memberData.total_commits}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    In this project
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                <CardTitle className="font-medium text-sm">
                                    Repositories
                                </CardTitle>
                                <GitBranch className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-bold text-2xl">
                                    {memberData.total_repositories}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Contributing to
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                <CardTitle className="font-medium text-sm">
                                    Lines Added
                                </CardTitle>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-bold text-green-600 text-2xl">
                                    {memberData.lines_added.toLocaleString()}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Code contributions
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                <CardTitle className="font-medium text-sm">
                                    Lines Removed
                                </CardTitle>
                                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-bold text-red-600 text-2xl">
                                    {memberData.lines_removed.toLocaleString()}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Code cleanup
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="gap-6 grid md:grid-cols-2">
                        {/* Contribution Graph */}
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
                                        <Activity className="mx-auto mb-2 w-8 h-8" />
                                        <p className="text-sm">
                                            Contribution graph
                                        </p>
                                        <p className="text-xs">
                                            Chart integration needed
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Recent Activity Summary
                                </CardTitle>
                                <CardDescription>
                                    Latest contributions to this project
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            Commits This Week
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Across all repositories
                                        </p>
                                    </div>
                                    <div className="font-bold text-2xl">8</div>
                                </div>
                                <div className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            Files Modified
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            In recent commits
                                        </p>
                                    </div>
                                    <div className="font-bold text-2xl">23</div>
                                </div>
                                <div className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            Average Commit Size
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Lines changed per commit
                                        </p>
                                    </div>
                                    <div className="font-bold text-2xl">
                                        156
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Commits Tab */}
                <TabsContent value="commits" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitCommit className="w-5 h-5" />
                                Recent Commits
                            </CardTitle>
                            <CardDescription>
                                Latest commits by {memberData.name} in this
                                project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Commit Message</TableHead>
                                        <TableHead>Repository</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Files</TableHead>
                                        <TableHead>Changes</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberCommits.map((commit) => (
                                        <TableRow key={commit.id}>
                                            <TableCell>
                                                <div className="flex items-start gap-2">
                                                    <FileText className="mt-0.5 w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {commit.message}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">
                                                            #{commit.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {commit.repository}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                                    {commit.branch}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                {commit.files_changed}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-green-600">
                                                        +{commit.lines_added}
                                                    </span>
                                                    <span className="text-red-600">
                                                        -{commit.lines_removed}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    commit.timestamp
                                                ).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Repository Contributions Tab */}
                <TabsContent value="repositories" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitBranch className="w-5 h-5" />
                                Repository Contributions
                            </CardTitle>
                            <CardDescription>
                                Breakdown of contributions across project
                                repositories
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Repository</TableHead>
                                        <TableHead>Commits</TableHead>
                                        <TableHead>Lines Added</TableHead>
                                        <TableHead>Lines Removed</TableHead>
                                        <TableHead>Last Commit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {repositoryContributions.map((repo) => (
                                        <TableRow key={repo.repository}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {repo.repository}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {repo.commits}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-green-600">
                                                    +
                                                    {repo.lines_added.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-red-600">
                                                    -
                                                    {repo.lines_removed.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {repo.last_commit}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
