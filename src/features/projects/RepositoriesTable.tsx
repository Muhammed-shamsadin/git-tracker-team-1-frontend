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

export function RepositoriesTable({
    repositories,
}: {
    repositories: ProjectDetail["repositories"];
}) {
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Repository</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Commits</TableHead>
                            <TableHead>Contributors</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
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
                                            <div className="text-muted-foreground text-xs">
                                                {repo.url || ""}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[300px]">
                                    <p className="truncate">
                                        {repo.description || ""}
                                    </p>
                                </TableCell>
                                <TableCell>{repo.commits ?? 0}</TableCell>
                                <TableCell>{repo.contributors ?? 0}</TableCell>
                                <TableCell>
                                    {repo.lastUpdated ? repo.lastUpdated : "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {repo.url && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <a
                                                    href={repo.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
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
                                                <DropdownMenuItem>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Edit Repository
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
