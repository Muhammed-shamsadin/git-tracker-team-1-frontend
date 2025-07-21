"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Repository } from "@/types/Repository";
import { mockRepositories } from "@/data/repositories";
import { Loader2 } from "lucide-react";

export default function RepositoryDetailsPage() {
    const { id } = useParams();
    const [repository, setRepository] = useState<Repository | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepository = async () => {
            const repo = mockRepositories.find((repo) => repo.id === id);
            setRepository(repo || null);
            setLoading(false);
        };

        fetchRepository();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    if (!repository) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Repository not found.</p>
            </div>
        );
    }
    const formatedName = repository.name.replace(/-/g, " ").toString();

    return (
        <div className="p-6">
            <h1 className="font-bold text-3xl capitalize tracking-tight">
                {formatedName}
            </h1>
            <p className="text-muted-foreground">{repository.description}</p>
            <div className="space-y-4 mt-4">
                <div>
                    <strong>Owner:</strong> {repository.owner}
                </div>
                <div>
                    <strong>Project ID:</strong> {repository.projectId}
                </div>
                <div>
                    <strong>Status:</strong> {repository.status}
                </div>
                <div>
                    <strong>Tags:</strong>{" "}
                    {repository.tags ? repository.tags.join(", ") : "None"}
                </div>
                <div>
                    <strong>Branch Count:</strong> {repository.branchCount}
                </div>
                <div>
                    <strong>Commit Count:</strong> {repository.commitCount}
                </div>
                <div>
                    <strong>Last Commit:</strong>{" "}
                    {repository.lastCommit
                        ? new Date(repository.lastCommit).toLocaleString()
                        : "N/A"}
                </div>
            </div>
        </div>
    );
}
