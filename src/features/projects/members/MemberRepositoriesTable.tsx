"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GitBranch, GitCommit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MemberRepository {
    id: string;
    name: string;
    totalCommits: number;
}

export function MemberRepositoriesTable({
    repositories,
}: {
    repositories: MemberRepository[];
}) {
    if (repositories.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <GitBranch className="mx-auto mb-4 w-12 h-12 text-muted-foreground/50" />
                    <h3 className="mb-2 font-medium text-lg">
                        No Repositories
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        This member has not contributed to any repositories in
                        this project yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Sort repositories by commit count (descending)
    const sortedRepositories = [...repositories].sort(
        (a, b) => b.totalCommits - a.totalCommits
    );

    // Calculate total commits across all repositories
    const totalCommits = repositories.reduce(
        (sum, repo) => sum + repo.totalCommits,
        0
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Repository Contributions
                    <Badge variant="secondary" className="ml-auto">
                        {repositories.length} repositories
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Repository Name</TableHead>
                            <TableHead className="text-right">
                                Commits
                            </TableHead>
                            <TableHead className="text-right">
                                Contribution %
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedRepositories.map((repo) => {
                            const contributionPercentage =
                                totalCommits > 0
                                    ? (
                                          (repo.totalCommits / totalCommits) *
                                          100
                                      ).toFixed(1)
                                    : "0";

                            return (
                                <TableRow key={repo.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                {repo.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-1">
                                            <GitCommit className="w-3 h-3 text-muted-foreground" />
                                            <span className="font-mono text-sm">
                                                {repo.totalCommits.toLocaleString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <div className="flex-1 bg-muted rounded-full max-w-[60px] h-2">
                                                <div
                                                    className="bg-primary rounded-full h-2 transition-all"
                                                    style={{
                                                        width: `${Math.max(
                                                            parseFloat(
                                                                contributionPercentage
                                                            ),
                                                            2
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-10 font-mono text-muted-foreground text-xs text-right">
                                                {contributionPercentage}%
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {/* Summary Footer */}
                <div className="bg-muted/50 px-6 py-3 border-t">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                            Total across {repositories.length} repositories
                        </span>
                        <div className="flex items-center gap-1 font-medium">
                            <GitCommit className="w-3 h-3" />
                            {totalCommits.toLocaleString()} commits
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
