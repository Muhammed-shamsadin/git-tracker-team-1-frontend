"use client";

import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="font-bold text-muted-foreground text-6xl">
                        404
                    </h1>
                    <h2 className="font-semibold text-2xl">Page Not Found</h2>
                    <p className="max-w-md text-muted-foreground">
                        The page you're looking for doesn't exist or has been
                        moved to another location.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        className="px-4 py-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Go Back
                    </Button>
                    <Button
                        className="px-4 py-2"
                        onClick={() => router.push("/")}
                    >
                        <Home className="mr-2 w-4 h-4" />
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
