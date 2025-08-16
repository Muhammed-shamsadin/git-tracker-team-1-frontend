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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Mail, MapPin, MoreHorizontal, Plus } from "lucide-react";
import { ProjectDetail } from "@/types/Project";

export function MembersTable({
    members,
    projectId,
}: {
    members: ProjectDetail["members"];
    projectId: string;
}) {
    if (members.length === 0) {
        return (
            <div className="p-4 text-muted-foreground text-center">
                No members found in this project.
            </div>
        );
    }
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Commits</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.user_id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    member?.avatar ||
                                                    "/placeholder.svg"
                                                }
                                            />
                                            <AvatarFallback>
                                                {member.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {member.name}
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                                <Mail className="w-3 h-3" />
                                                {member.email}
                                            </div>
                                            {member?.location && (
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                                    <MapPin className="w-3 h-3" />
                                                    {member?.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            member.role === "owner"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {member.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>{member?.commits ?? 0}</TableCell>
                                <TableCell>
                                    {member.joined_at
                                        ? new Date(
                                              member.joined_at
                                          ).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    {member?.last_active ?? "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/dashboard/projects/${projectId}/members/${member.user_id}`}
                                            >
                                                View Details
                                            </Link>
                                        </Button>
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
                                                    Change Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Send Message
                                                </DropdownMenuItem>
                                                {member.role !== "owner" && (
                                                    <DropdownMenuItem className="text-destructive">
                                                        Remove from Project
                                                    </DropdownMenuItem>
                                                )}
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
