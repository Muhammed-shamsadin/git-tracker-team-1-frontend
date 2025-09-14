import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GitCommit,
    GitBranch,
    TrendingUp,
    FileText,
    FilePlus,
    FileX,
} from "lucide-react";

export function MemberStatsGrid({
    memberData,
}: {
    memberData: {
        total_commits: number;
        total_repositories: number;
        lines_added: number;
        lines_removed: number;
        files_added?: number;
        files_removed?: number;
        files_changed?: number;
    };
}) {
    const hasFileStats =
        memberData.files_added !== undefined ||
        memberData.files_removed !== undefined ||
        memberData.files_changed !== undefined;

    return (
        <div className="space-y-6">
            {/* Primary Stats Grid */}
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
                            {memberData.total_commits.toLocaleString()}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            In this project
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
                            {memberData.total_repositories}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Contributing to
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Lines Added
                        </CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-green-600 text-2xl">
                            {memberData.lines_added.toLocaleString()}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Code contributions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Lines Removed
                        </CardTitle>
                        <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-red-600 text-2xl">
                            {memberData.lines_removed.toLocaleString()}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Code cleanup
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* File Statistics Grid (if available) */}
            {hasFileStats && (
                <div className="gap-4 grid md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">
                                Files Added
                            </CardTitle>
                            <FilePlus className="w-4 h-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-bold text-green-600 text-2xl">
                                {(memberData.files_added || 0).toLocaleString()}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                New files created
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">
                                Files Modified
                            </CardTitle>
                            <FileText className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-bold text-blue-600 text-2xl">
                                {(
                                    memberData.files_changed || 0
                                ).toLocaleString()}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Files updated
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">
                                Files Removed
                            </CardTitle>
                            <FileX className="w-4 h-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-bold text-red-600 text-2xl">
                                {(
                                    memberData.files_removed || 0
                                ).toLocaleString()}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Files deleted
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
