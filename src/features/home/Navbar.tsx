"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GitFork, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navigationItems = [
    { name: "Features", href: "#features" },
    { name: "Download", href: "#download" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="flex justify-center items-center bg-primary rounded-lg size-8 aspect-square text-primary-foreground group-hover:scale-105 transition-transform">
                            <GitFork className="size-4" />
                        </div>
                        <span className="font-bold text-xl">GitTracker</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navigationItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.href)}
                                className="font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <ThemeToggle />
                        <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? (
                                <X className="size-5" />
                            ) : (
                                <Menu className="size-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden top-16 right-0 left-0 absolute bg-background/95 shadow-lg backdrop-blur-md border-b">
                        <nav className="flex flex-col gap-4 p-4">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href)}
                                    className="py-2 font-medium text-foreground/80 hover:text-foreground text-left transition-colors duration-200"
                                >
                                    {item.name}
                                </button>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t">
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Log In</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
