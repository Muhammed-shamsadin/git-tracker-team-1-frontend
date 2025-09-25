import {
    Download,
    Apple,
    Monitor,
    HardDrive,
    BarChart3,
    FolderPlus,
    RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const downloadOptions = [
    {
        platform: "Windows",
        icon: Monitor,
        description: "Windows 10 or later",
        size: "89 MB",
        version: "v1.0.1",
        downloadUrl: "https://drive.google.com/file/d/1uZ521E7l_H34HrMUeyc5EWUF3FzTDSco/view",
    },
    {
        platform: "macOS",
        icon: Apple,
        description: "macOS 11.0 or later",
        size: "256.7 MB",
        version: "v0.2.2",
        downloadUrl: "#",
    },
    {
        platform: "Linux",
        icon: HardDrive,
        description: "Ubuntu 20.04+ / Fedora 35+",
        size: "145.1 MB",
        version: "v0.2.2",
        downloadUrl: "#",
    },
];

export function DownloadSection() {
    return (
        <section id="download" className="bg-background py-20 lg:py-32">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 mb-6 px-4 py-2 rounded-full font-medium text-primary text-sm">
                        <Download className="w-4 h-4" />
                        <span>Developer Tools</span>
                    </div>

                    <h2 className="mb-4 font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                        Download GitTracker
                        <span className="text-primary"> Desktop App</span>
                    </h2>

                    <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
                        Install the GitTracker desktop application to register
                        your local repositories, sync with projects, and track
                        your development progress directly from your development
                        environment.
                    </p>
                </div>

                <div className="gap-8 grid md:grid-cols-3 mx-auto mb-16 max-w-5xl">
                    {downloadOptions.map((option, idx) => (
                        <Card
                            key={option.platform}
                            className="group hover:shadow-lg text-center transition-all hover:-translate-y-1 duration-300"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 rounded-xl w-16 h-16 text-primary transition-colors duration-300">
                                    <option.icon className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">
                                    {option.platform}
                                </CardTitle>
                                <p className="text-muted-foreground text-sm">
                                    {option.description}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Version {option.version}</span>
                                    <span>{option.size}</span>
                                </div>
                                {idx === 0 ? (
                                    <Button className="w-full" asChild>
                                        <a href={option.downloadUrl} download>
                                            <Download className="mr-2 w-4 h-4" />
                                            Download
                                        </a>
                                    </Button>
                                ) : (
                                    <Button className="w-full" disabled>
                                        <Download className="mr-2 w-4 h-4" />
                                        Coming Soon
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Features */}
                <div className="mb-16 text-center">
                    <h3 className="mb-8 font-semibold text-xl">
                        What you can do with the desktop app
                    </h3>
                    <div className="gap-6 grid md:grid-cols-3 mx-auto max-w-4xl text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-lg w-12 h-12">
                                <FolderPlus className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-medium">
                                Register Repositories
                            </h4>
                            <p className="text-muted-foreground">
                                Add your local Git repositories to GitTracker
                                projects and start tracking automatically.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-lg w-12 h-12">
                                <RefreshCcw className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-medium">Auto Sync</h4>
                            <p className="text-muted-foreground">
                                Automatically sync repository data including
                                commits, branches, and file changes.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-lg w-12 h-12">
                                <BarChart3 className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-medium">Track Progress</h4>
                            <p className="text-muted-foreground">
                                Monitor your development activity and view
                                analytics on your contributions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* System Requirements */}
                <div className="mx-auto max-w-4xl">
                    <h3 className="mb-8 font-semibold text-xl text-center">
                        System Requirements
                    </h3>
                    <div className="gap-6 grid md:grid-cols-3 text-sm">
                        <div className="space-y-2">
                            <h4 className="font-medium">Windows</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Windows 10 (64-bit) or later</li>
                                <li>• 4 GB RAM minimum</li>
                                <li>• 400 MB available storage</li>
                                <li>• Git installed on system</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">macOS</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• macOS 11.0 or later</li>
                                <li>• Apple Silicon or Intel processor</li>
                                <li>• 4 GB RAM minimum</li>
                                <li>• Git command line tools</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Linux</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Ubuntu 20.04+ / Fedora 35+</li>
                                <li>• x64 architecture</li>
                                <li>• 4 GB RAM minimum</li>
                                <li>• Git package installed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
