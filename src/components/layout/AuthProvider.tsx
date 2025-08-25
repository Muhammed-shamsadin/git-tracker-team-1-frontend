"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Loader } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkAuth } = useAuthStore();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await checkAuth();
            } catch (e) {
                // swallow/log if desired
                // console.error("Auth check failed", e);
            } finally {
                if (mounted) setReady(true);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [checkAuth]);

    if (!ready) {
        return (
            <div className="flex justify-center items-center bg-background p-6 h-full min-h-screen text-foreground">
                <div className="flex flex-col items-center gap-6 p-8 w-full text-card-foreground">
                    <div className="flex justify-center items-center bg-gradient-to-br from-sidebar-primary to-primary shadow-md rounded-full w-24 h-24">
                        <span className="font-extrabold text-white text-xl">
                            GT
                        </span>
                    </div>

                    <h1 className="font-semibold text-2xl">Git Tracker</h1>

                    <p className="max-w-xs text-muted-foreground text-sm text-center">
                        Checking authentication and preparing your workspace.
                        This may take a moment.
                    </p>

                    <div
                        role="status"
                        aria-live="polite"
                        className="flex flex-col items-center mt-4"
                    >
                        <Loader
                            className="w-12 h-12 text-primary animate-spin"
                            aria-hidden="true"
                        />
                        <span className="sr-only">
                            Loading authentication...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
