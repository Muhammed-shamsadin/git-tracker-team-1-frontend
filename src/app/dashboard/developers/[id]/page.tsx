"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Settings,
    Mail,
    MapPin,
    Calendar,
    Activity,
    GitCommit,
    FolderGit2,
    GitBranch,
    TrendingUp,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data
const developerData = {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    role: "Full Stack Developer",
    avatar: "/placeholder.svg?height=80&width=80",
    location: "San Francisco, CA",
    bio: "Experienced full-stack developer with 8+ years in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.",
    skills: [
        "React",
        "Node.js",
        "TypeScript",
        "AWS",
        "Docker",
        "PostgreSQL",
        "GraphQL",
        "Next.js",
    ],
    joined_at: "2024-03-15T10:00:00Z",
    last_active: "2 hours ago",
    stats: {
        total_projects: 4,
        total_repositories: 8,
        total_commits: 342,
        lines_of_code: 25680,
    },
};

const projects = [
    {
        id: "p1234567-8901-2345-6789-012345678901",
        name: "Git Tracker",
        description: "Track local git repositories and developer progress",
        status: "active",
        role: "Lead Developer",
        repositories_count: 3,
        commits: 127,
        last_updated: "2025-08-03T12:00:00Z",
    },
    {
        id: "p2345678-9012-3456-7890-123456789012",
        name: "E-commerce Platform",
        description: "Modern e-commerce solution with React and Node.js",
        status: "active",
        role: "Backend Developer",
        repositories_count: 2,
        commits: 89,
        last_updated: "2025-08-02T15:30:00Z",
    },
    {
        id: "p3456789-0123-4567-8901-234567890123",
        name: "Mobile App",
        description: "React Native mobile application for iOS and Android",
        status: "completed",
        role: "Full Stack Developer",
        repositories_count: 1,
        commits: 67,
        last_updated: "2025-07-28T09:15:00Z",
    },
];

const repositories = [
    {
        id: "r1",
        name: "git-tracker-backend",
        project: "Git Tracker",
        description: "NestJS backend for Git Tracker application",
        commits: 78,
        lines_added: 8450,
        lines_removed: 2100,
        last_commit: "2 hours ago",
    },
    {
        id: "r2",
        name: "git-tracker-frontend",
        project: "Git Tracker",
        description: "Next.js frontend for Git Tracker application",
        commits: 34,
        lines_added: 2890,
        lines_removed: 890,
        last_commit: "1 day ago",
    },
    {
        id: "r3",
        name: "ecommerce-api",
        project: "E-commerce Platform",
        description: "REST API for e-commerce platform",
        commits: 45,
        lines_added: 3200,
        lines_removed: 1200,
        last_commit: "2 days ago",
    },
];

const recentCommits = [
    {
        id: "c1",
        message: "Added user authentication system with JWT tokens",
        repository: "git-tracker-backend",
        project: "Git Tracker",
        timestamp: "2025-08-03T10:30:00Z",
        files_changed: 8,
        lines_added: 245,
        lines_removed: 12,
    },
    {
        id: "c2",
        message: "Updated dashboard UI components and responsive design",
        repository: "git-tracker-frontend",
        project: "Git Tracker",
        timestamp: "2025-08-03T08:15:00Z",
        files_changed: 12,
        lines_added: 189,
        lines_removed: 45,
    },
    {
        id: "c3",
        message: "Implemented payment processing with Stripe integration",
        repository: "ecommerce-api",
        project: "E-commerce Platform",
        timestamp: "2025-08-02T16:45:00Z",
        files_changed: 6,
        lines_added: 156,
        lines_removed: 23,
    },
];

export default function DeveloperDetailsPage() {
    const params = useParams();
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/developers">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Developers
                    </Link>
                </Button>
            </div>

            {/* Developer Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-6">
                    <Avatar className="w-20 h-20">
                        <AvatarImage
                            src={developerData.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-lg">
                            {developerData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-3xl tracking-tight">
                                {developerData.name}
                            </h1>
                            <Badge variant="secondary">
                                {developerData.role}
                            </Badge>
                        </div>
                        <p className="max-w-2xl text-muted-foreground">
                            {developerData.bio}
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {developerData.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {developerData.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Joined{" "}
                                {new Date(
                                    developerData.joined_at
                                ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Active {developerData.last_active}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {developerData.skills.map((skill) => (
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
                {developerData.id && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 w-4 h-4" />
                                Settings
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                    <TabsTrigger value="commits">Recent Commits</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Quick Stats */}
                    <div className="gap-4 grid md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                <CardTitle className="font-medium text-sm">
                                    Projects
                                </CardTitle>
                                <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-bold text-2xl">
                                    {developerData.stats.total_projects}
                                </div>
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
                                    {developerData.stats.total_repositories}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                <CardTitle className="font-medium text-sm">
                                    Total Commits
                                </CardTitle>
                                <GitCommit className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-bold text-2xl">
                                    {developerData.stats.total_commits}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                <CardTitle className="font-medium text-sm">
                                    Lines of Code
                                </CardTitle>
                                <Activity className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-bold text-2xl">
                                    {developerData.stats.lines_of_code.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="gap-6 grid md:grid-cols-2">
                        {/* Contribution Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Contribution Activity
                                </CardTitle>
                                <CardDescription>
                                    Daily commit activity over the last 30 days
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center items-center border-2 border-muted-foreground/25 border-dashed rounded-lg h-[200px]">
                                    <div className="text-muted-foreground text-center">
                                        <TrendingUp className="mx-auto mb-2 w-8 h-8" />
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

                        {/* Performance Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    Performance Summary
                                </CardTitle>
                                <CardDescription>
                                    Key metrics and achievements
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            Commits This Month
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Across all projects
                                        </p>
                                    </div>
                                    <div className="font-bold text-2xl">45</div>
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
                                <div className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            Code Quality Score
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Based on reviews and tests
                                        </p>
                                    </div>
                                    <div className="font-bold text-green-600 text-2xl">
                                        92%
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderGit2 className="w-5 h-5" />
                                Developer Projects
                            </CardTitle>
                            <CardDescription>
                                All projects this developer is working on
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Repositories</TableHead>
                                        <TableHead>Commits</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {project.name}
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {project.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {project.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        project.status ===
                                                        "active"
                                                            ? "secondary"
                                                            : "outline"
                                                    }
                                                >
                                                    {project.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {project.repositories_count}
                                            </TableCell>
                                            <TableCell>
                                                {project.commits}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    project.last_updated
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/projects/${project.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Repositories Tab */}
                <TabsContent value="repositories" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitBranch className="w-5 h-5" />
                                Repository Contributions
                            </CardTitle>
                            <CardDescription>
                                Repositories this developer has contributed to
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Repository</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Commits</TableHead>
                                        <TableHead>Lines Added</TableHead>
                                        <TableHead>Lines Removed</TableHead>
                                        <TableHead>Last Commit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {repositories.map((repo) => (
                                        <TableRow key={repo.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {repo.name}
                                                        </div>
                                                        <div className="text-muted-foreground text-sm">
                                                            {repo.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {repo.project}
                                                </Badge>
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

                {/* Commits Tab */}
                <TabsContent value="commits" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitCommit className="w-5 h-5" />
                                Recent Commits
                            </CardTitle>
                            <CardDescription>
                                Latest commits by this developer
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Repository</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Files</TableHead>
                                        <TableHead>Changes</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentCommits.map((commit) => (
                                        <TableRow key={commit.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {commit.message}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        #{commit.id}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {commit.repository}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {commit.project}
                                                </Badge>
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
            </Tabs>
        </div>
    );
}
