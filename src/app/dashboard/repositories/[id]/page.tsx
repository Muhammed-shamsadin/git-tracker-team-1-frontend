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
    ExternalLink,
    GitBranch,
    Activity,
    Calendar,
    Users,
    GitCommit,
    TrendingUp,
    FileText,
    Plus,
    Minus,
} from "lucide-react";
import Link from "next/link";

// Mock data
const repositoryData = {
    id: "r1",
    name: "git-tracker-backend",
    description:
        "NestJS backend for Git Tracker application with comprehensive API endpoints",
    url: "https://github.com/example/git-tracker-backend",
    path: "C:/Users/dev/projects/git-tracker-backend",
    project: {
        id: "p1234567-8901-2345-6789-012345678901",
        name: "Git Tracker",
    },
    owner: {
        id: "u1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    created_at: "2025-08-01T10:00:00Z",
    updated_at: "2025-08-03T12:00:00Z",
    last_synced: "2025-08-03T12:00:00Z",
    stats: {
        total_commits: 127,
        total_contributors: 3,
        files_count: 45,
        lines_of_code: 12450,
    },
};

const commits = [
    {
        id: "c1",
        author: {
            name: "John Doe",
            avatar: "/placeholder.svg?height=24&width=24",
        },
        message: "Added user authentication system with JWT tokens",
        timestamp: "2025-08-03T10:30:00Z",
        branch: "main",
        files_changed: 8,
        lines_added: 245,
        lines_removed: 12,
    },
    {
        id: "c2",
        author: {
            name: "Jane Smith",
            avatar: "/placeholder.svg?height=24&width=24",
        },
        message: "Updated API documentation and added Swagger integration",
        timestamp: "2025-08-03T08:15:00Z",
        branch: "feature/api-docs",
        files_changed: 12,
        lines_added: 189,
        lines_removed: 45,
    },
    {
        id: "c3",
        author: {
            name: "Mike Brown",
            avatar: "/placeholder.svg?height=24&width=24",
        },
        message: "Fixed database connection pooling issues",
        timestamp: "2025-08-02T16:45:00Z",
        branch: "bugfix/db-connection",
        files_changed: 3,
        lines_added: 67,
        lines_removed: 23,
    },
];

export default function RepositoryDetailsPage({ params }: any) {
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/repositories">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Repositories
                    </Link>
                </Button>
            </div>

            {/* Repository Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <GitBranch className="w-8 h-8 text-muted-foreground" />
                        <h1 className="font-bold text-3xl tracking-tight">
                            {repositoryData.name}
                        </h1>
                    </div>
                    <p className="max-w-2xl text-muted-foreground">
                        {repositoryData.description}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created{" "}
                            {new Date(
                                repositoryData.created_at
                            ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            Last synced{" "}
                            {new Date(
                                repositoryData.last_synced
                            ).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">
                            Project: {repositoryData.project.name}
                        </Badge>
                        <Badge variant="outline">
                            Owner: {repositoryData.owner.name}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <a
                            href={repositoryData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 w-4 h-4" />
                            View on GitHub
                        </a>
                    </Button>
                    <Button variant="outline">
                        <Settings className="mr-2 w-4 h-4" />
                        Settings
                    </Button>
                </div>
            </div>

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
                            {repositoryData.stats.total_commits}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Contributors
                        </CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {repositoryData.stats.total_contributors}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Files
                        </CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {repositoryData.stats.files_count}
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
                            {repositoryData.stats.lines_of_code.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commits">Commits</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="gap-6 grid md:grid-cols-2">
                        {/* Commit Activity Chart */}
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
                                <div className="flex justify-center items-center border-2 border-muted-foreground/25 border-dashed rounded-lg h-[200px]">
                                    <div className="text-muted-foreground text-center">
                                        <TrendingUp className="mx-auto mb-2 w-8 h-8" />
                                        <p className="text-sm">
                                            Commit activity chart
                                        </p>
                                        <p className="text-xs">
                                            Chart integration needed
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Repository Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Repository Information</CardTitle>
                                <CardDescription>
                                    Details about this repository
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        URL
                                    </span>
                                    <a
                                        href={repositoryData.url}
                                        className="text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {repositoryData.url}
                                    </a>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Local Path
                                    </span>
                                    <code className="bg-muted px-2 py-1 rounded text-xs">
                                        {repositoryData.path}
                                    </code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Owner
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage
                                                src={
                                                    repositoryData.owner
                                                        .avatar ||
                                                    "/placeholder.svg"
                                                }
                                            />
                                            <AvatarFallback>
                                                {repositoryData.owner.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{repositoryData.owner.name}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Created
                                    </span>
                                    <span>
                                        {new Date(
                                            repositoryData.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Last Updated
                                    </span>
                                    <span>
                                        {new Date(
                                            repositoryData.updated_at
                                        ).toLocaleDateString()}
                                    </span>
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
                                Latest commits in this repository
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Files</TableHead>
                                        <TableHead>Changes</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commits.map((commit) => (
                                        <TableRow key={commit.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage
                                                            src={
                                                                commit.author
                                                                    .avatar ||
                                                                "/placeholder.svg"
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            {
                                                                commit.author
                                                                    .name[0]
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">
                                                        {commit.author.name}
                                                    </span>
                                                </div>
                                            </TableCell>
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
                                                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                                    {commit.branch}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                {commit.files_changed}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <Plus className="w-3 h-3" />
                                                        {commit.lines_added}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-red-600">
                                                        <Minus className="w-3 h-3" />
                                                        {commit.lines_removed}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    commit.timestamp
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/repositories/${params.id}/commits/${commit.id}`}
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
            </Tabs>
        </div>
    );
}
