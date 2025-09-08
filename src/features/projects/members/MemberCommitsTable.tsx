import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GitCommit, FileText, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export function MemberCommitsTable({
    memberCommits,
    memberName,
}: {
    memberCommits: {
        id: string;
        message: string;
        repository: string;
        repositoryId?: string;
        branch: string;
        files_changed: number;
        lines_added: number;
        lines_removed: number;
        timestamp: string;
    }[];
    memberName: string;
}) {
    if (!memberCommits || memberCommits.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        Recent Commits
                    </CardTitle>
                    <CardDescription>
                        Latest commits by {memberName} in this project
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground">No commits found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GitCommit className="w-5 h-5" />
                    Recent Commits
                </CardTitle>
                <CardDescription>
                    Latest commits by {memberName} in this project
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
                                            <Link
                                                href={`/dashboard/repositories/${
                                                    commit.repositoryId ||
                                                    "placeholder"
                                                }/commits/${commit.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {commit.message.split("\n")[0]
                                                    .length > 50
                                                    ? commit.message
                                                          .split("\n")[0]
                                                          .slice(0, 50) + "..."
                                                    : commit.message.split(
                                                          "\n"
                                                      )[0]}
                                            </Link>
                                            <p className="text-muted-foreground text-xs">
                                                #{commit.id.substring(0, 7)}
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
                                <TableCell>{commit.files_changed}</TableCell>
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
                                    {timeAgo(commit.timestamp)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
