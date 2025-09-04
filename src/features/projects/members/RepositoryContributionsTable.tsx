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
import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function RepositoryContributionsTable({
    repositoryContributions,
}: {
    repositoryContributions: {
        repository: string;
        commits: number;
        lines_added: number;
        lines_removed: number;
        last_commit: string;
    }[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Repository Contributions
                </CardTitle>
                <CardDescription>
                    Breakdown of contributions across project repositories
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
                                        +{repo.lines_added.toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium text-red-600">
                                        -{repo.lines_removed.toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell>{repo.last_commit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
