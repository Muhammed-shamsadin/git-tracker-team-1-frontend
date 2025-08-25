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
import { GitCommit, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MemberCommitsTable({
    memberCommits,
    memberName,
}: {
    memberCommits: {
        id: string;
        message: string;
        repository: string;
        branch: string;
        files_changed: number;
        lines_added: number;
        lines_removed: number;
        timestamp: string;
    }[];
    memberName: string;
}) {
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
                    {" "}
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
                                <TableCell>{commit.files_changed}</TableCell>
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
    );
}
