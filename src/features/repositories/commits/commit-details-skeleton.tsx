import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function CommitDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Skeleton className="w-32 h-9" />
            </div>
            <div className="space-y-4">
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-48" />
            </div>
            <div className="gap-4 grid md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-24" />
                ))}
            </div>
            <Skeleton className="w-full h-96" />
        </div>
    );
}
