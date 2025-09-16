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
                            {/* Replace placeholder with your image */}
                            <div className="relative bg-white/50 dark:bg-black/20 border-2 border-primary/30 border-dashed rounded-xl aspect-[16/10] overflow-hidden">
                                <Image
                                    src="/assets/Dashbaord.png" // put your file here: public/assets/hero-dashboard.png
                                    alt="GitTracker dashboard preview"
                                    fill
                                    priority
                                    sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
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
