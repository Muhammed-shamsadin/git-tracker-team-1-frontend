import {
    GitFork,
    Users,
    BarChart3,
    Database,
    Clock,
    Target,
} from "lucide-react";

const features = [
    {
        category: "Repository Management",
        title: "Register and track repositories effortlessly",
        description:
            "Register your local Git repositories and connect them to projects. Track changes, commits, and branches automatically with real-time monitoring.",
        image: <img src="/assets/repo detail.png" alt="Repository Management" className="w-full h-auto rounded-lg shadow" />,
    },
    {
        category: "Team Collaboration",
        title: "Manage projects and team members",
        description:
            "Create and manage development projects with ease. Invite team members, organize repositories under specific projects, and streamline collaboration.",
        image: <img src="/assets/new project.png" alt="Team Collaboration" className="w-full h-auto rounded-lg shadow" />,
    },
    {
        category: "Analytics & Insights",
        title: "Comprehensive performance analytics",
        description:
            "Get detailed insights into developer contributions, commit patterns, and project progress. Analyze team performance with powerful metrics and visualizations.",
        image: <img src="/assets/analytics.png" alt="Analytics & Insights" className="w-full h-auto rounded-lg shadow" />,
    },
    {
        category: "Data Collection",
        title: "Automated Git data collection",
        description:
            "Seamlessly collect Git data including branch information, commit details, and file changes from your registered repositories with automated polling.",
        image: <img src="/assets/commit detail page.png" alt="Data Collection" className="w-full h-auto rounded-lg shadow" />,
    },
    {
        category: "Real-time Monitoring",
        title: "Monitor repository activity live",
        description:
            "Track repository activity in real-time with periodic polling. Stay updated on the latest changes and monitor development progress as it happens.",
        image: <img src="/assets/dev project.png" alt="Real-time Monitoring" className="w-full h-auto rounded-lg shadow" />,
    },
    {
        category: "Performance Metrics",
        title: "Compare and analyze team insights",
        description:
            "Compare developer contributions across projects and analyze team performance metrics. Identify bottlenecks and optimize your development workflow.",
        image: <img src="/assets/repo commit.png" alt="Performance Metrics" className="w-full h-auto rounded-lg shadow" />,
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="bg-muted/30 py-20 lg:py-32">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="mb-4 font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                        Everything you need for
                        <span className="text-primary"> Git tracking</span>
                    </h2>
                    <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
                        Powerful features designed for development teams to
                        track repositories, analyze performance, and manage
                        projects effectively.
                    </p>
                </div>

                {/* Features List */}
                <div className="space-y-20 mx-auto mb-20 w-full max-w-7xl">
                    {features.map((feature, index) => (
                        <div
                            key={feature.category}
                            className="flex md:flex-row md:even:flex-row-reverse flex-col items-center gap-x-12 gap-y-6"
                        >
                            {/* Feature Image/Placeholder */}
                            <div className="group flex justify-center items-center bg-muted border border-border/50 rounded-xl w-full aspect-[4/3] overflow-hidden transition-all duration-300 basis-1/2">
                                <div className="p-8 text-center">
                                    {feature.image}
                                </div>
                            </div>

                            {/* Feature Content */}
                            <div className="basis-1/2 shrink-0">
                                <span className="font-medium text-muted-foreground text-sm uppercase">
                                    {feature.category}
                                </span>
                                <h4 className="my-3 font-semibold text-2xl tracking-tight">
                                    {feature.title}
                                </h4>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="pt-16 border-t border-border/50">
                    <div className="gap-8 grid grid-cols-2 md:grid-cols-4 text-center">
                        <div className="space-y-2">
                            <div className="font-bold text-primary text-3xl md:text-4xl">
                                500+
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Repositories Tracked
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-bold text-primary text-3xl md:text-4xl">
                                50+
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Active Projects
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-bold text-primary text-3xl md:text-4xl">
                                100+
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Developers
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-bold text-primary text-3xl md:text-4xl">
                                24/7
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Monitoring
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
