import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How do I register my local Git repositories?",
        answer: "Download the GitTracker desktop application, create an account, and use the simple interface to register your local repositories. The app will automatically connect to your Git repos and start tracking data.",
    },
    {
        question:
            "Can I track repositories from different Git hosting services?",
        answer: "Yes! GitTracker works with any Git repository regardless of where it's hosted - GitHub, GitLab, Bitbucket, or even private Git servers. We track local repository data, not remote hosting.",
    },
    {
        question: "What kind of data does GitTracker collect?",
        answer: "We collect Git metadata including commit information, branch details, file changes, and contributor activity. We never access your actual code content - only Git history and statistics.",
    },
    {
        question: "How do projects and team collaboration work?",
        answer: "Clients can create projects and invite developers to join. Team members can register their repositories under specific projects, allowing for collaborative tracking and shared analytics across the team.",
    },
    {
        question: "Is my repository data secure?",
        answer: "Absolutely. GitTracker only collects Git metadata and commit information. Your actual source code never leaves your local machine. All data transmission is encrypted and stored securely.",
    },
    {
        question: "How often is repository data updated?",
        answer: "The desktop application periodically polls your registered repositories (typically every 10 minutes) to collect the latest Git data and sync it with your projects.",
    },
    {
        question: "Can I remove my repositories from tracking?",
        answer: "Yes, you can easily unregister repositories from projects at any time through the desktop application or web dashboard. All associated data will be removed from our systems.",
    },
    {
        question: "Do I need an internet connection to use GitTracker?",
        answer: "The desktop application requires an internet connection to sync data with your projects and team. However, it can queue data locally when offline and sync when reconnected.",
    },
    {
        question: "What operating systems are supported?",
        answer: "GitTracker desktop applications are available for Windows 10+, macOS 11+, and popular Linux distributions including Ubuntu and Fedora. Git must be installed on your system.",
    },
];

export function FAQSection() {
    return (
        <section id="faq" className="bg-background py-20 lg:py-32">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 mb-6 px-4 py-2 rounded-full font-medium text-primary text-sm">
                        <HelpCircle className="w-4 h-4" />
                        <span>Frequently Asked Questions</span>
                    </div>

                    <h2 className="mb-4 font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                        Got questions?
                        <span className="text-primary"> We've got answers</span>
                    </h2>

                    <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
                        Everything you need to know about GitTracker. Can't find
                        the answer you're looking for? Feel free to reach out to
                        our support team.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-card/50 backdrop-blur-sm px-6 border rounded-lg"
                            >
                                <AccordionTrigger className="py-6 font-medium text-left hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h3 className="mb-4 font-semibold text-xl">
                            Still have questions?
                        </h3>
                        <p className="mb-6 text-muted-foreground">
                            Can't find the answer you're looking for? Please
                            chat with our friendly team - we're here to help!
                        </p>
                        <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
                            <a
                                href="mailto:support@gittracker-et.com"
                                className="inline-flex justify-center items-center bg-primary hover:bg-primary/90 disabled:opacity-50 px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 h-10 font-medium text-primary-foreground text-sm transition-colors disabled:pointer-events-none"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
