import type React from "react";
import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import AppNavbar from "@/components/layout/app-nav";

export const metadata: Metadata = {
    title: "Dashboard - GitTracker",
    description: "Repository management dashboard",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full h-screen">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                    <AppNavbar />
                    <SidebarInset>
                        <main className="flex-1 bg-muted/20 p-6 overflow-auto">
                            <div className="mx-auto w-full max-w-[2000px]">
                                {children}
                            </div>
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
