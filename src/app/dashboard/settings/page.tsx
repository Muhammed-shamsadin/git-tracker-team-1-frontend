"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Github, Linkedin, Twitter } from "lucide-react";

export default function SettingsPage() {
    const [skills, setSkills] = useState([
        "React",
        "TypeScript",
        "Node.js",
        "Python",
        "AWS",
    ]);
    const [newSkill, setNewSkill] = useState("");

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill("");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your profile and application preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <p className="text-muted-foreground text-sm">
                                Update your personal details and profile
                                information
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage
                                        src="/placeholder.svg?height=80&width=80"
                                        alt="User Avatar"
                                    />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <Button variant="outline" size="sm">
                                        Change Avatar
                                    </Button>
                                    <p className="text-muted-foreground text-xs">
                                        JPG, GIF or PNG. 1MB max.
                                    </p>
                                </div>
                            </div>

                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">
                                        First Name
                                    </Label>
                                    <Input
                                        id="first-name"
                                        defaultValue="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" defaultValue="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title-position">
                                    Title/Position
                                </Label>
                                <Input
                                    id="title-position"
                                    defaultValue="Senior Full-Stack Developer"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue="john@example.com"
                                    disabled
                                />
                            </div>

                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        defaultValue="+1 (555) 123-4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        defaultValue="San Francisco, CA"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="personal-website">
                                    Personal Website
                                </Label>
                                <Input
                                    id="personal-website"
                                    defaultValue="https://yourwebsite.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    defaultValue="Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Skills & Technologies</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Add Skill"
                                        className="w-auto"
                                        value={newSkill}
                                        onChange={(e) =>
                                            setNewSkill(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addSkill}
                                    >
                                        <Plus className="mr-1 w-4 h-4" /> Add
                                        Skill
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Social Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Github className="w-5 h-5 text-muted-foreground" />
                                <Input placeholder="johndoe" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Linkedin className="w-5 h-5 text-muted-foreground" />
                                <Input placeholder="johndoe" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Twitter className="w-5 h-5 text-muted-foreground" />
                                <Input placeholder="@johndoe" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contacts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <div>
                                    <p className="font-medium">Sarah Manager</p>
                                    <p className="text-muted-foreground text-sm">
                                        Project Manager
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground text-sm">
                                        sarah@company.com
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        +1 (555) 123-4568
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="mr-1 w-4 h-4" /> Add Contact
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Organization (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="organization-name">
                                        Organization Name
                                    </Label>
                                    <Input
                                        id="organization-name"
                                        defaultValue="Tech Solutions Inc"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="organization-website">
                                        Organization Website
                                    </Label>
                                    <Input
                                        id="organization-website"
                                        defaultValue="https://techsolutions.com"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button>
                            <Save className="mr-2 w-4 h-4" />
                            Save Profile
                        </Button>
                    </div>
                </TabsContent>

                {/* Placeholder for other tabs */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Manage your notification preferences here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Configure your security settings.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Customize the application's appearance.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
