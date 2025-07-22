"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStats } from "./project-stats";
import { RecentActivity } from "./recent-activity";
import { ProjectHealth } from "./project_health";
import RepositoriesPage from "./repositories";
import TeamPage from "./team";

export function ProjectOverview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Web Application</h1>
              <Badge variant="secondary">active</Badge>
            </div>
            <p className="text-muted-foreground">
              Main customer-facing web application built with React and Next.js
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Render project stats, activity, and recent activity components */}
          <ProjectStats />
          <ProjectHealth />
          <RecentActivity />
        </TabsContent>
        <TabsContent value="repositories" className="space-y-4">
          <RepositoriesPage />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
