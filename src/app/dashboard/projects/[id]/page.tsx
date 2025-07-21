"use client";
import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import { mockProjects } from "@/data/projects";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Handle both string and number IDs by converting to string for comparison
        const foundProject = mockProjects.find(
            (proj) => String(proj.id) === String(id)
        );
        if (!foundProject) {
            setProject(null);
            setIsLoading(false);
            return;
        }

        setProject(foundProject || null);
        setIsLoading(false);
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center space-x-2 h-full">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p>Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return <p>Project not found</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="font-bold text-3xl tracking-tight">
                {project.name}
            </h1>
            <p className="text-muted-foreground">{project.description}</p>
            <div className="space-y-4">
                <div>
                    <strong>Owner:</strong> {project.owner}
                </div>
                <div>
                    <strong>Status:</strong> {project.status}
                </div>
                <div>
                    <strong>Repositories:</strong>{" "}
                    {project.repositories.join(", ")}
                </div>
                <div>
                    <strong>Tags:</strong>{" "}
                    {project.tags ? project.tags.join(", ") : ""}
                </div>
            </div>
        </div>
    );
}
