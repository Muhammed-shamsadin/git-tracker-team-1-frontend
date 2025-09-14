"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function RepositoryDetailsLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-48 h-9" />
                        <Skeleton className="w-16 h-6" />
                    </div>
                    <Skeleton className="w-96 h-4" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-32 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-16 h-5" />
                        <Skeleton className="w-12 h-5" />
                        <Skeleton className="w-20 h-5" />
                    </div>
                </div>
                <Skeleton className="w-24 h-10" />
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-6">
                <div className="flex space-x-1">
                    <Skeleton className="w-20 h-10" />
                    <Skeleton className="w-24 h-10" />
                    <Skeleton className="w-20 h-10" />
                </div>

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
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="gap-6 grid md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="w-32 h-6" />
                            <Skeleton className="w-48 h-4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="rounded-full w-8 h-8" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="w-full h-4" />
                                        <Skeleton className="w-3/4 h-3" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="w-32 h-6" />
                            <Skeleton className="w-48 h-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-full h-[200px]" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
