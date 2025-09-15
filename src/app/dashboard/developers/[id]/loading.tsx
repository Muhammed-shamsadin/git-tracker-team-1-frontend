import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

export default function DeveloperDetailsLoading() {
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" disabled>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Developers
                </Button>
            </div>

            {/* Developer Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-6">
                    <Skeleton className="rounded-full w-20 h-20" />
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-48 h-8" />
                            <Skeleton className="rounded-full w-32 h-6" />
                        </div>
                        <Skeleton className="w-96 h-4" />
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <Skeleton className="w-40 h-4" />
                            <Skeleton className="w-32 h-4" />
                            <Skeleton className="w-28 h-4" />
                            <Skeleton className="w-24 h-4" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="rounded-full w-16 h-6"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Quick Stats */}
                    <div className="gap-4 grid md:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                                    <Skeleton className="w-20 h-4" />
                                    <Skeleton className="w-4 h-4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-12 h-8" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="gap-6 grid md:grid-cols-2">
                        <Skeleton className="w-full h-64" />
                        <Skeleton className="w-full h-64" />
                    </div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-5 h-5" />
                                <Skeleton className="w-40 h-6" />
                            </div>
                            <Skeleton className="w-64 h-4" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border rounded-md">
                                <div className="p-4 border-b">
                                    <div className="gap-4 grid grid-cols-7">
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-12 h-4" />
                                        <Skeleton className="w-14 h-4" />
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                    </div>
                                </div>
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="p-4 last:border-0 border-b"
                                    >
                                        <div className="items-center gap-4 grid grid-cols-7">
                                            <div className="space-y-1">
                                                <Skeleton className="w-24 h-4" />
                                                <Skeleton className="w-32 h-3" />
                                            </div>
                                            <Skeleton className="rounded-full w-20 h-6" />
                                            <Skeleton className="rounded-full w-16 h-6" />
                                            <Skeleton className="w-8 h-4" />
                                            <Skeleton className="w-12 h-4" />
                                            <Skeleton className="w-20 h-4" />
                                            <Skeleton className="w-16 h-8" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Repositories Tab */}
                <TabsContent value="repositories" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-5 h-5" />
                                <Skeleton className="w-48 h-6" />
                            </div>
                            <Skeleton className="w-72 h-4" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border rounded-md">
                                <div className="p-4 border-b">
                                    <div className="gap-4 grid grid-cols-6">
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-24 h-4" />
                                        <Skeleton className="w-20 h-4" />
                                    </div>
                                </div>
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="p-4 last:border-0 border-b"
                                    >
                                        <div className="items-center gap-4 grid grid-cols-6">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-4 h-4" />
                                                <div className="space-y-1">
                                                    <Skeleton className="w-32 h-4" />
                                                    <Skeleton className="w-40 h-3" />
                                                </div>
                                            </div>
                                            <Skeleton className="rounded-full w-20 h-6" />
                                            <Skeleton className="rounded-full w-12 h-6" />
                                            <Skeleton className="w-16 h-4" />
                                            <Skeleton className="w-16 h-4" />
                                            <Skeleton className="w-16 h-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
