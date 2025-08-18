import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsListSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="mb-2 w-40 h-8" />
                    <Skeleton className="w-64 h-4" />
                </div>
                <Skeleton className="w-32 h-10" />
            </div>
            {/* Table skeleton */}
            <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="rounded-md w-full h-12" />
                ))}
            </div>
        </div>
    );
}
