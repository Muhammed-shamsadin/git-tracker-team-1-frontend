import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ClientDetailsLoading() {
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Clients
                    </Link>
                </Button>
            </div>

            {/* Client Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-6">
                    <Skeleton className="rounded-full w-20 h-20" />
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-64 h-9" />
                            <Skeleton className="w-20 h-6" />
                        </div>
                        <Skeleton className="w-96 h-5" />
                        <div className="gap-2 grid md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-40 h-4" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-32 h-4" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-36 h-4" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-40 h-4" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-32 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="gap-4 grid md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
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

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="gap-6 grid md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <Skeleton className="w-36 h-6" />
                                <Skeleton className="w-48 h-4" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between"
                                    >
                                        <Skeleton className="w-24 h-4" />
                                        <Skeleton className="w-32 h-4" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-5 h-5" />
                                <Skeleton className="w-32 h-6" />
                            </div>
                            <Skeleton className="w-56 h-4" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border rounded-lg">
                                {/* Table Header */}
                                <div className="border-b">
                                    <div className="gap-4 grid grid-cols-5 p-4">
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-12 h-4" />
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-24 h-4" />
                                    </div>
                                </div>
                                {/* Table Rows */}
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="border-b last:border-b-0"
                                    >
                                        <div className="gap-4 grid grid-cols-5 p-4">
                                            <div className="space-y-1">
                                                <Skeleton className="w-24 h-4" />
                                                <Skeleton className="w-32 h-3" />
                                            </div>
                                            <Skeleton className="w-16 h-5" />
                                            <Skeleton className="w-8 h-4" />
                                            <Skeleton className="w-12 h-4" />
                                            <Skeleton className="w-20 h-4" />
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
                                <Skeleton className="w-36 h-6" />
                            </div>
                            <Skeleton className="w-64 h-4" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border rounded-lg">
                                {/* Table Header */}
                                <div className="border-b">
                                    <div className="gap-4 grid grid-cols-5 p-4">
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-24 h-4" />
                                    </div>
                                </div>
                                {/* Table Rows */}
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="border-b last:border-b-0"
                                    >
                                        <div className="gap-4 grid grid-cols-5 p-4">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-4 h-4" />
                                                <Skeleton className="w-32 h-4" />
                                            </div>
                                            <Skeleton className="w-20 h-5" />
                                            <Skeleton className="w-40 h-4" />
                                            <Skeleton className="w-12 h-4" />
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
