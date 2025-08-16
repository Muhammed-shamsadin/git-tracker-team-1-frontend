"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";

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
            <div className="flex justify-center items-center p-4 min-h-screen text-muted-foreground">
                Loading authentication...
            </div>
        );
    }

    return <>{children}</>;
}
