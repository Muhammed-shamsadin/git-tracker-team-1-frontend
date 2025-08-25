import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Clock } from "lucide-react";

export function MemberHeader({
    member,
}: {
    member: {
        avatar: string;
        name: string;
        bio: string;
        email: string;
        joined_at: string;
        last_active: string;
        skills: string[];
    };
}) {
    return (
        <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                    {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="font-bold text-3xl tracking-tight">
                        {member.name}
                    </h1>
                </div>
                <p className="max-w-4xl text-muted-foreground">{member.bio}</p>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {member.email}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Active {member.last_active}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {member.skills.map((skill) => (
                        <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
