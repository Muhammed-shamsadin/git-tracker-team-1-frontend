import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Star } from "lucide-react";
import Link from "next/link";
import React, { ComponentProps } from "react";

const testimonials = [
    {
        id: 1,
        name: "Mahlet Tadesse",
        designation: "Lead Developer",
        company: "TechHub Addis",
        testimonial:
            "GitTracker has revolutionized how our team tracks repository activity. The analytics help us understand each developer's contributions and identify bottlenecks in our projects. Setup was incredibly easy.",
        rating: 5,
        avatar: "MT",
    },
    {
        id: 2,
        name: "Daniel Bekele",
        designation: "Project Manager",
        company: "Innovation Labs",
        testimonial:
            "Managing multiple development projects became much simpler with GitTracker. I can see real-time progress across all repositories and track team performance without micromanaging.",
        rating: 5,
        avatar: "DB",
    },
    {
        id: 3,
        name: "Hanna Girma",
        designation: "DevOps Engineer",
        company: "Code Craft",
        testimonial:
            "The repository registration process is seamless. We connected all our local repos to projects within minutes. The automatic data collection saves us hours of manual tracking work.",
        rating: 5,
        avatar: "HG",
    },
    {
        id: 4,
        name: "Samuel Teshome",
        designation: "Software Developer",
        company: "Digital Solutions ET",
        testimonial:
            "Being able to see my contribution analytics helps me stay motivated and track my growth. The desktop app works perfectly with our existing Git workflow without any interruptions.",
        rating: 5,
        avatar: "ST",
    },
    {
        id: 5,
        name: "Meron Asefa",
        designation: "Tech Lead",
        company: "StartupHub Ethiopia",
        testimonial:
            "GitTracker gives us insights into team collaboration patterns we never had before. The project management features help us organize repositories and track developer involvement across multiple projects.",
        rating: 5,
        avatar: "MA",
    },
    {
        id: 6,
        name: "Yohannes Mekonnen",
        designation: "Full Stack Developer",
        company: "EthioTech Solutions",
        testimonial:
            "The performance analytics are incredibly detailed. I can see my commit patterns, contribution trends, and how my work impacts overall project progress. It's like having a personal development coach.",
        rating: 5,
        avatar: "YM",
    },
];

const TestimonialsSection = () => (
    <div className="flex justify-center items-center py-12 min-h-screen">
        <div className="w-full h-full">
            <h2 className="px-6 font-semibold text-5xl text-center text-pretty tracking-[-0.03em]">
                Trusted by developers
                <span className="text-primary"> in Ethiopia</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-xl text-center">
                See how development teams across Ethiopia are using GitTracker
                to improve their repository management and track project
                progress.
            </p>
            <div className="relative mt-14">
                <div className="left-0 z-10 absolute inset-y-0 bg-linear-to-r from-background to-transparent w-[15%]" />
                <div className="right-0 z-10 absolute inset-y-0 bg-linear-to-l from-background to-transparent w-[15%]" />
                <Marquee pauseOnHover className="[--duration:20s]">
                    <TestimonialList />
                </Marquee>
                <Marquee pauseOnHover reverse className="mt-0 [--duration:20s]">
                    <TestimonialList />
                </Marquee>
            </div>
        </div>
    </div>
);

const TestimonialList = () =>
    testimonials.map((testimonial) => (
        <div
            key={testimonial.id}
            className="bg-accent p-6 rounded-xl min-w-96 max-w-sm"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback className="bg-primary font-medium text-primary-foreground text-xl">
                            {testimonial.avatar}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">
                            {testimonial.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                            {testimonial.designation}
                        </p>
                        <p className="font-medium text-primary text-xs">
                            {testimonial.company}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#" target="_blank">
                        <TwitterLogo className="w-4 h-4" />
                    </Link>
                </Button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-4 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                        key={i}
                        className="fill-yellow-400 w-4 h-4 text-yellow-400"
                    />
                ))}
            </div>

            <p className="text-[17px]">{testimonial.testimonial}</p>
        </div>
    ));

const TwitterLogo = (props: ComponentProps<"svg">) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <title>X</title>
        <path
            fill="currentColor"
            d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
        />
    </svg>
);

export { TestimonialsSection };
