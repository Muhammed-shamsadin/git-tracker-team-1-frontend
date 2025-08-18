import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDetailsLoading() {
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <Skeleton className="w-48 h-9" />

            {/* Member Header */}
            <div className="flex items-start gap-6">
                <Skeleton className="rounded-full w-20 h-20" />
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-48 h-9" />
                        <Skeleton className="w-16 h-6" />
                    </div>
                    <Skeleton className="w-96 h-4" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-32 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="w-16 h-5" />
                        ))}
                    </div>
                </div>
                <Skeleton className="w-32 h-10" />
            </div>

            {/* Tabs Content Skeleton */}
            <div className="space-y-6">
                <div className="flex space-x-1">
                    <Skeleton className="w-20 h-10" />
                    <Skeleton className="w-28 h-10" />
                    <Skeleton className="w-36 h-10" />
                </div>

                <div className="gap-6 grid md:grid-cols-2">
                    {/* Stats Skeleton */}
                    <div className="gap-4 grid md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                    <Skeleton className="w-24 h-4" />
                                    <Skeleton className="w-4 h-4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-16 h-8" />
                                    <Skeleton className="mt-1 w-20 h-3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Card>
                        <CardHeader>
                            <Skeleton className="w-40 h-6" />
                            <Skeleton className="w-56 h-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-full h-[200px]" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="w-48 h-6" />
                            <Skeleton className="w-64 h-4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center p-3 border rounded-lg"
                                >
                                    <div className="space-y-1">
                                        <Skeleton className="w-32 h-4" />
                                        <Skeleton className="w-24 h-3" />
                                    </div>
                                    <Skeleton className="w-8 h-8" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
