"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GitBranch, ExternalLink, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ProjectDetail } from "@/types/Project";
import { timeAgo } from "@/lib/utils";

export function RepositoriesTable({
    repositories,
}: {
    repositories: ProjectDetail["repositories"];
}) {
    if (repositories.length === 0) {
        return (
            <div className="p-4 text-muted-foreground text-center">
                No repositories found for this project.
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Repository</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registered By</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {repositories.map((repo) => (
                            <TableRow key={repo._id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <Link
                                                href={`/dashboard/repositories/${repo._id}`}
                                                className="font-medium text-foreground hover:underline"
                                            >
                                                {repo.name}
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{repo.status}</TableCell>
                                <TableCell>
                                    {repo.registeredBy?.name || "-"}
                                    <div className="text-muted-foreground text-xs">
                                        {repo.registeredBy?.email || ""}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {repo.lastUpdated
                                        ? timeAgo(repo.lastUpdated)
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/dashboard/repositories/${repo._id}`}
                                                    >
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="text-destructive">
                                                    Remove from Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
