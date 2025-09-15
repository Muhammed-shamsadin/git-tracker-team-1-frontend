"use client";
import {
    Navbar,
    HeroSection,
    FeaturesSection,
    CallToActionSection,
    DownloadSection,
    TestimonialsSection,
    FAQSection,
    Footer,
} from "@/features/home";

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <CallToActionSection />
                <DownloadSection />
                <TestimonialsSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}
