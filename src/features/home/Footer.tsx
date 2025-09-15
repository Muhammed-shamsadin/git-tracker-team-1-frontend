import Link from "next/link";
import {
    GitFork,
    Github,
    Twitter,
    Linkedin,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

const footerSections = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "#features" },
            { name: "Download", href: "#download" },
            { name: "Dashboard", href: "/dashboard" },
        ],
    },
    {
        title: "Support",
        links: [
            { name: "FAQ", href: "#faq" },
            { name: "Contact", href: "mailto:support@gittracker-et.com" },
            { name: "Documentation", href: "/docs" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
        ],
    },
];

const socialLinks = [
    {
        name: "GitHub",
        href: "https://github.com/gittracker",
        icon: Github,
    },
    {
        name: "Twitter",
        href: "https://twitter.com/gittracker",
        icon: Twitter,
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/company/gittracker",
        icon: Linkedin,
    },
    {
        name: "Email",
        href: "mailto:contact@gittracker-et.com",
        icon: Mail,
    },
];

export function Footer() {
    const scrollToSection = (href: string) => {
        if (href.startsWith("#")) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    };

    return (
        <footer className="bg-muted/30 border-t">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                {/* Main Footer Content */}
                <div className="py-16">
                    <div className="gap-8 grid lg:grid-cols-6">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <Link
                                href="/"
                                className="flex items-center gap-2 mb-4"
                            >
                                <div className="flex justify-center items-center bg-primary rounded-lg size-8 aspect-square text-primary-foreground">
                                    <GitFork className="size-4" />
                                </div>
                                <span className="font-bold text-xl">
                                    GitTracker
                                </span>
                            </Link>
                            <p className="mb-6 max-w-md text-muted-foreground leading-relaxed">
                                The complete repository management platform for
                                modern development teams. Streamline your
                                workflow, enhance collaboration, and gain
                                insights into your codebase.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3 text-muted-foreground text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Addis Ababa, Ethiopia</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+(251) 9-12-34-56-78</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>contact@gittracker-et.com</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-4 mt-6">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="flex justify-center items-center bg-background hover:bg-primary border hover:border-primary rounded-lg w-10 h-10 hover:text-primary-foreground transition-all duration-200"
                                        aria-label={social.name}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Footer Links */}
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-4 font-semibold text-foreground">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            {link.href.startsWith("#") ? (
                                                <button
                                                    onClick={() =>
                                                        scrollToSection(
                                                            link.href
                                                        )
                                                    }
                                                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                                                >
                                                    {link.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-8 border-t">
                    <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                        <div className="flex md:flex-row flex-col items-center gap-4 text-muted-foreground text-sm">
                            <p>
                                © {new Date().getFullYear()} GitTracker. All
                                rights reserved.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/privacy"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Privacy
                                </Link>
                                <Link
                                    href="/terms"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Terms
                                </Link>
                                <Link
                                    href="/cookies"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Cookies
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span>Made with</span>
                            <span className="text-red-500">♥</span>
                            <span>in Addis Ababa</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
