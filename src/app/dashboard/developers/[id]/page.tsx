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
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import DeveloperDetailsLoading from "./loading";
import { timeAgo } from "@/lib/utils";

export default function DeveloperDetailsPage() {
    const params = useParams();
    const { developerDetails, isLoading, error, fetchDevDetail } =
        useUserStore();

    const developerId = params.id as string;

    useEffect(() => {
        if (developerId) {
            fetchDevDetail(developerId);
        }
    }, [developerId, fetchDevDetail]);

    if (isLoading) {
        return <DeveloperDetailsLoading />;
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/developers">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to Developers
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-2 text-center">
                            <h3 className="font-semibold text-destructive text-lg">
                                Error
                            </h3>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!developerDetails) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/developers">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to Developers
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-2 text-center">
                            <h3 className="font-semibold text-lg">
                                Developer Not Found
                            </h3>
                            <p className="text-muted-foreground">
                                The developer you're looking for doesn't exist.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { user, stats, projects, repositories } = developerDetails;
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
                            src={user.profileImage || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-lg">
                            {user.fullName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-3xl tracking-tight">
                                {user.fullName}
                            </h1>
                            <Badge variant="secondary">
                                {user.userType === "developer"
                                    ? "Developer"
                                    : user.userType}
                            </Badge>
                        </div>
                        <p className="max-w-2xl text-muted-foreground">
                            {user.profile?.bio || "No bio available"}
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            {user.profile?.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {user.profile.location}
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Joined{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            {user.lastLogin && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Last login{" "}
                                    {new Date(
                                        user.lastLogin
                                    ).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        {user.profile?.skills &&
                            user.profile.skills.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    {user.profile.skills.map(
                                        (skill: string) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {skill}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
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
                                    {stats.totalProjects}
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
                                    {stats.totalRepositories}
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
                                    {stats.totalCommits}
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
                                    {stats.totalLinesOfCode.toLocaleString()}
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

                                        <TableHead>Status</TableHead>
                                        <TableHead>Repositories</TableHead>
                                        <TableHead>Commits</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project: any) => (
                                        <TableRow key={project.projectId}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {project.projectName}
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {
                                                            project.projectDescription
                                                        }
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        project.projectStatus ===
                                                        "active"
                                                            ? "secondary"
                                                            : "outline"
                                                    }
                                                >
                                                    {project.projectStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {project.totalRepos}
                                            </TableCell>
                                            <TableCell>
                                                {project.totalCommits}
                                            </TableCell>
                                            <TableCell>
                                                {timeAgo(project.lastUpdated)}
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

                                        <TableHead>Last Commit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {repositories.map((repo: any) => (
                                        <TableRow key={repo.repoId}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {repo.repoName}
                                                        </div>
                                                        <div className="text-muted-foreground text-sm">
                                                            {
                                                                repo.repoDescription
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {repo.projectName}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {repo.totalCommits}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {timeAgo(repo.lastUpdated)}
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
