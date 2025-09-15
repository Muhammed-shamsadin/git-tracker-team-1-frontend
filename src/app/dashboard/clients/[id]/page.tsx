"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import ClientDetailsLoading from "./loading";
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
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building,
    Users,
    FolderGit2,
    GitBranch,
    Activity,
} from "lucide-react";
import Link from "next/link";

export default function ClientDetailsPage() {
    const params = useParams();
    const { clientDetails, isLoading, error, fetchClientDetail } =
        useUserStore();

    const clientId = params.id as string;

    useEffect(() => {
        if (clientId) {
            fetchClientDetail(clientId);
        }
    }, [clientId, fetchClientDetail]);

    if (isLoading) {
        return <ClientDetailsLoading />;
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/clients">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to Clients
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

    if (!clientDetails) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/clients">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to Clients
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-2 text-center">
                            <h3 className="font-semibold text-lg">
                                Client Not Found
                            </h3>
                            <p className="text-muted-foreground">
                                The client you're looking for doesn't exist.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { user, stats, projects, repositories } = clientDetails;
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Clients
                    </Link>
                </Button>
            </div>

            {/* Client Header */}
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
                            <Badge variant="secondary">{user.userType}</Badge>
                            {user.companyName && (
                                <Badge variant="outline">
                                    {user.companyName}
                                </Badge>
                            )}
                        </div>
                        {user.profile?.bio && (
                            <p className="max-w-2xl text-muted-foreground">
                                {user.profile.bio}
                            </p>
                        )}
                        <div className="gap-2 grid md:grid-cols-2">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            {user.phoneNumber && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Phone className="w-4 h-4" />
                                    {user.phoneNumber}
                                </div>
                            )}
                            {user.profile?.location && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <MapPin className="w-4 h-4" />
                                    {user.profile.location}
                                </div>
                            )}
                            {user.companyName && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Building className="w-4 h-4" />
                                    {user.companyName}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Client since{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        {user.profile?.skills &&
                            user.profile.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {user.profile.skills.map(
                                        (skill: string) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
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

            {/* Quick Stats */}
            <div className="gap-4 grid md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Total Projects
                        </CardTitle>
                        <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {stats.totalProjects}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            projects managed
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
                            {stats.totalRepositories}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Team Members
                        </CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {stats.totalMembers}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Last Activity
                        </CardTitle>
                        <Activity className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {stats.lastActivity
                                ? new Date(
                                      stats.lastActivity
                                  ).toLocaleDateString()
                                : "N/A"}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            last updated
                        </p>
                    </CardContent>
                </Card>
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
                    <div className="gap-6 grid md:grid-cols-2">
                        {/* Client Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Information</CardTitle>
                                <CardDescription>
                                    Detailed information about this client
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Full Name
                                    </span>
                                    <span className="font-medium">
                                        {user.fullName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Email
                                    </span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        User Type
                                    </span>
                                    <Badge variant="outline">
                                        {user.userType}
                                    </Badge>
                                </div>
                                {user.companyName && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Company
                                        </span>
                                        <span>{user.companyName}</span>
                                    </div>
                                )}
                                {user.phoneNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Phone
                                        </span>
                                        <span>{user.phoneNumber}</span>
                                    </div>
                                )}
                                {user.profile?.location && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Location
                                        </span>
                                        <span>{user.profile.location}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Client Since
                                    </span>
                                    <span>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Last Login
                                    </span>
                                    <span>
                                        {user.lastLogin
                                            ? new Date(
                                                  user.lastLogin
                                              ).toLocaleDateString()
                                            : "Never"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Status
                                    </span>
                                    <Badge
                                        variant={
                                            user.isActive
                                                ? "secondary"
                                                : "destructive"
                                        }
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
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
                                Client Projects
                            </CardTitle>
                            <CardDescription>
                                All projects associated with this client
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {projects && projects.length > 0 ? (
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
                                                            {
                                                                project.projectName
                                                            }
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
                                                                : project.projectStatus ===
                                                                  "completed"
                                                                ? "default"
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
                                                    {new Date(
                                                        project.lastUpdated
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-muted-foreground text-center">
                                    No projects found for this client.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Repositories Tab */}
                <TabsContent value="repositories" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitBranch className="w-5 h-5" />
                                Client Repositories
                            </CardTitle>
                            <CardDescription>
                                All repositories across client projects
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {repositories && repositories.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Repository</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Commits</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {repositories.map((repo: any) => (
                                            <TableRow key={repo.repoId}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {repo.repoName}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {repo.projectName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-[300px] truncate">
                                                    {repo.repoDescription}
                                                </TableCell>
                                                <TableCell>
                                                    {repo.totalCommits}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        repo.lastUpdated
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-muted-foreground text-center">
                                    No repositories found for this client.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
