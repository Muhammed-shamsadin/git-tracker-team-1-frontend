import Link from "next/link";
import { ArrowRight, GitFork, Users, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const features = [
    {
        icon: GitFork,
        title: "Repository Management",
        description:
            "Centralized dashboard for all your Git repositories with real-time insights and analytics.",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description:
            "Manage developers and clients in one place with detailed profiles and project tracking.",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description:
            "Track project progress, code quality, and developers performance with comprehensive analytics.",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description:
            "Bank-level security with role-based access control and audit trails.",
    },
];

export default function LandingPage() {
    return (
        <div className="bg-gradient-to-br from-background to-muted min-h-screen">
            {/* Header */}
            <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center bg-primary rounded-lg size-8 aspect-square text-primary-foreground">
                                <GitFork className="size-4" />
                            </div>
                            <span className="font-bold text-xl">
                                GitTracker
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Button variant="ghost" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 lg:py-32">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight">
                            Manage Your Git Repositories
                            <span className="text-primary"> Like a Pro</span>
                        </h1>
                        <p className="mt-6 text-muted-foreground text-lg sm:text-xl leading-8">
                            Streamline your development workflow with our
                            comprehensive repository management platform. Track
                            projects, manage teams, and gain insights into your
                            codebase.
                        </p>
                        <div className="flex justify-center items-center gap-4 mt-10">
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/dashboard">View Demo</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-bold text-3xl sm:text-4xl tracking-tight">
                            Everything you need to manage your repositories
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg">
                            Powerful features designed for modern development
                            teams
                        </p>
                    </div>
                    <div className="gap-8 grid sm:grid-cols-2 lg:grid-cols-4 mt-16">
                        {features.map((feature) => (
                            <Card key={feature.title} className="text-center">
                                <CardHeader>
                                    <div className="flex justify-center items-center bg-primary mx-auto rounded-lg w-12 h-12 text-primary-foreground">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-bold text-3xl sm:text-4xl tracking-tight">
                            Ready to get started?
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg">
                            Join thousands of developers and teams already using
                            GitTracker
                        </p>
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    Create Account
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background border-t">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 container">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center bg-primary rounded-lg size-6 aspect-square text-primary-foreground">
                                <GitFork className="size-3" />
                            </div>
                            <span className="font-semibold">GitTracker</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} GitTracker. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
