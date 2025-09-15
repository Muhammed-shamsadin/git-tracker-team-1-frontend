import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundPattern } from "./BackgroundPattern";

export function HeroSection() {
    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <section className="relative bg-gradient-to-br from-background via-background to-primary/5 pt-24 lg:pt-32 pb-20 lg:pb-32">
            <BackgroundPattern />
            <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 container">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Title */}
                    <h1 className="mb-6 font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight">
                        Track Your Git Repositories
                        <br />
                        <span className="text-primary">
                            Analyze Developer Performance
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mb-10 max-w-3xl text-muted-foreground text-lg sm:text-xl leading-relaxed">
                        A comprehensive Git tracking platform for development
                        teams. Register your local repositories, join projects,
                        and gain insights into team contributions and project
                        progress through powerful analytics.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-16">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px]"
                            asChild
                        >
                            <Link href="/signup">
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px]"
                            onClick={() => scrollToSection("#features")}
                        >
                            <Play className="mr-2 w-4 h-4" />
                            Learn More
                        </Button>
                    </div>

                    {/* Hero Image/Screenshot */}
                    <div className="z-10 relative mx-auto max-w-5xl">
                        <div className="z-10 relative bg-gradient-to-br from-primary/10 to-primary/5 shadow-2xl p-8 rounded-2xl overflow-hidden">
                            <div className="relative flex justify-center items-center bg-white/50 dark:bg-black/20 border-2 border-primary/30 border-dashed rounded-xl aspect-[16/10]">
                                <div className="p-8 text-center">
                                    <div className="flex justify-center items-center bg-primary/20 mx-auto mb-4 rounded-lg w-16 h-16">
                                        <svg
                                            className="w-8 h-8 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        GitTracker dashboard screenshot -
                                        project management interface showing
                                        repository analytics, developer
                                        contributions, and team performance
                                        metrics
                                    </p>
                                </div>
                            </div>
                            {/* Floating cards for visual interest */}
                            {/* <div className="hidden lg:block -top-4 -right-4 absolute bg-card shadow-lg p-4 border rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="bg-green-500 rounded-full w-2 h-2"></div>
                                    <span className="font-medium">
                                        Live Repository Tracking
                                    </span>
                                </div>
                            </div>
                            <div className="hidden lg:block -bottom-4 -left-4 absolute bg-card shadow-lg p-4 border rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="bg-blue-500 rounded-full w-2 h-2"></div>
                                    <span className="font-medium">
                                        Performance Analytics
                                    </span>
                                </div>
                            </div> */}
                        </div>
                        {/* Background decoration */}
                        <div className="-z-10 absolute inset-0">
                            <div className="top-10 right-10 absolute bg-primary/10 blur-xl rounded-full w-20 h-20"></div>
                            <div className="bottom-10 left-10 absolute bg-blue-500/10 blur-xl rounded-full w-32 h-32"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
