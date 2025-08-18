import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Mail,
    MapPin,
    Calendar,
    Activity,
    GitCommit,
    TrendingUp,
    Clock,
    FileText,
    GitBranch,
} from "lucide-react";
import Link from "next/link";
import { MemberHeader } from "@/features/projects/members/MemberHeader";
import { MemberStatsGrid } from "@/features/projects/members/MemberStatsGrid";
import { ContributionGraphPlaceholder } from "@/features/projects/members/ContributionGraphPlaceholder";
import { RecentActivitySummary } from "@/features/projects/members/RecentActivitySummary";
import { MemberCommitsTable } from "@/features/projects/members/MemberCommitsTable";
import { RepositoryContributionsTable } from "@/features/projects/members/RepositoryContributionsTable";

// Mock data - replace with API calls
const memberData = {
    user_id: "u1",
    name: "John Doe",
    email: "john@example.com",
    role: "owner",
    avatar: "/placeholder.svg?height=80&width=80",
    joined_at: "2025-08-01T10:00:00Z",
    last_active: "2 hours ago",
    location: "San Francisco, CA",
    bio: "Full-stack developer with 8+ years of experience in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
    total_commits: 127,
    total_repositories: 3,
    lines_added: 12450,
    lines_removed: 3200,
};

const projectData = {
    id: "p1234567-8901-2345-6789-012345678901",
    name: "Git Tracker",
};

const memberCommits = [
    {
        id: "c1",
        message: "Added user authentication system with JWT tokens",
        repository: "git-tracker-backend",
        branch: "main",
        timestamp: "2025-08-03T10:30:00Z",
        files_changed: 8,
        lines_added: 245,
        lines_removed: 12,
    },
    {
        id: "c2",
        message: "Updated dashboard UI components and responsive design",
        repository: "git-tracker-frontend",
        branch: "feature/dashboard-update",
        timestamp: "2025-08-03T08:15:00Z",
        files_changed: 12,
        lines_added: 189,
        lines_removed: 45,
    },
    {
        id: "c3",
        message: "Fixed database connection pooling issues",
        repository: "git-tracker-backend",
        branch: "bugfix/db-connection",
        timestamp: "2025-08-02T16:45:00Z",
        files_changed: 3,
        lines_added: 67,
        lines_removed: 23,
    },
    {
        id: "c4",
        message: "Implemented real-time notifications system",
        repository: "git-tracker-backend",
        branch: "feature/notifications",
        timestamp: "2025-08-02T14:20:00Z",
        files_changed: 15,
        lines_added: 423,
        lines_removed: 8,
    },
    {
        id: "c5",
        message: "Added unit tests for authentication module",
        repository: "git-tracker-backend",
        branch: "main",
        timestamp: "2025-08-01T11:30:00Z",
        files_changed: 6,
        lines_added: 156,
        lines_removed: 0,
    },
];

const contributionStats = [
    { date: "2025-08-01", commits: 3 },
    { date: "2025-08-02", commits: 5 },
    { date: "2025-08-03", commits: 2 },
    { date: "2025-08-04", commits: 0 },
    { date: "2025-08-05", commits: 4 },
    { date: "2025-08-06", commits: 1 },
    { date: "2025-08-07", commits: 3 },
];

const repositoryContributions = [
    {
        repository: "git-tracker-backend",
        commits: 78,
        lines_added: 8450,
        lines_removed: 2100,
        last_commit: "2 hours ago",
    },
    {
        repository: "git-tracker-frontend",
        commits: 34,
        lines_added: 2890,
        lines_removed: 890,
        last_commit: "1 day ago",
    },
    {
        repository: "git-tracker-mobile",
        commits: 15,
        lines_added: 1110,
        lines_removed: 210,
        last_commit: "3 days ago",
    },
];

export default function MemberDetailsPage({ params }: any) {
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects`}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to {projectData.name}
                    </Link>
                </Button>
            </div>

            {/* Member Header */}
            <MemberHeader member={memberData} />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commits">Recent Commits</TabsTrigger>
                    <TabsTrigger value="repositories">
                        Repository Contributions
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <MemberStatsGrid memberData={memberData} />
                    <div className="gap-6 grid md:grid-cols-2">
                        <ContributionGraphPlaceholder />
                        <RecentActivitySummary />
                    </div>
                </TabsContent>

                {/* Commits Tab */}
                <TabsContent value="commits" className="space-y-6">
                    <MemberCommitsTable
                        memberCommits={memberCommits}
                        memberName={memberData.name}
                    />
                </TabsContent>

                {/* Repository Contributions Tab */}
                <TabsContent value="repositories" className="space-y-6">
                    <RepositoryContributionsTable
                        repositoryContributions={repositoryContributions}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
