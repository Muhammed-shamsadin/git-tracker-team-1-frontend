import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToActionSection() {
    return (
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20 lg:py-32">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 mb-6 px-4 py-2 rounded-full font-medium text-primary text-sm">
                        <GitBranch className="w-4 h-4" />
                        <span>Start Tracking Today</span>
                    </div>

                    <h2 className="mb-6 font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                        Ready to track your
                        <br />
                        <span className="text-primary">
                            development projects?
                        </span>
                    </h2>

                    <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-lg sm:text-xl leading-relaxed">
                        Join development teams already using GitTracker to
                        monitor repository activity, analyze developer
                        contributions, and manage project progress effectively.
                    </p>

                    <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-12">
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
                    </div>

                    {/* Value propositions */}
                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-3 mx-auto max-w-2xl text-muted-foreground text-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex justify-center items-center bg-green-500/20 rounded-lg w-8 h-8">
                                <div className="bg-green-500 rounded-full w-3 h-3"></div>
                            </div>
                            <span>Free to use</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex justify-center items-center bg-blue-500/20 rounded-lg w-8 h-8">
                                <div className="bg-blue-500 rounded-full w-3 h-3"></div>
                            </div>
                            <span>Easy setup</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex justify-center items-center bg-purple-500/20 rounded-lg w-8 h-8">
                                <div className="bg-purple-500 rounded-full w-3 h-3"></div>
                            </div>
                            <span>Real-time tracking</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
