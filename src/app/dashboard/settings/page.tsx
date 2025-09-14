"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Github, Linkedin, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const router = useRouter();

  const { currentUser, updateMe, isLoading: storeLoading } = useUserStore();
  const { user: authUser } = useAuthStore();

  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
  ]);
  const [newSkill, setNewSkill] = useState("");

  // local form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  // avatar handling
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  // populate local state from auth user (preferred) or currentUser when available
  useEffect(() => {
    if (authUser) {
      const nameParts = (authUser.fullName || "").split(" ");
      setFirstName(nameParts.shift() || "");
      setLastName(nameParts.join(" ") || "");
      setEmail(authUser.email || "");
    } else if (currentUser) {
      const nameParts = (currentUser.fullName || "").split(" ");
      setFirstName(nameParts.shift() || "");
      setLastName(nameParts.join(" ") || "");
      setEmail(currentUser.email || "");
    }

    if (currentUser) {
      setLocation(currentUser.profile?.location || "");
      setOrganizationName(currentUser.companyName || "");
      if (
        currentUser.profile?.skills &&
        Array.isArray(currentUser.profile.skills)
      ) {
        setSkills(currentUser.profile.skills);
      }
    }

    // load avatar from localStorage if available
    try {
      const storageKey = `avatar:${currentUser?._id ?? authUser?._id ?? "me"}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) setAvatarSrc(stored);
    } catch (err) {
      // ignore localStorage errors
    }
  }, [authUser, currentUser]);

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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <p className="text-muted-foreground text-sm">
                Update your personal details and profile information
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={
                      avatarSrc ||
                      currentUser?.avatarUrl ||
                      "/placeholder.svg?height=80&width=80"
                    }
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {`${(firstName || "").charAt(0) || ""}${
                      (lastName || "").charAt(0) || ""
                    }`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div>
                    <p className="font-medium">
                      {`${firstName} ${lastName}`.trim() ||
                        currentUser?.fullName ||
                        authUser?.fullName}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {email || currentUser?.email || authUser?.email}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        setAvatarSrc(dataUrl);
                        try {
                          const storageKey = `avatar:${
                            currentUser?._id ?? authUser?._id ?? "me"
                          }`;
                          localStorage.setItem(storageKey, dataUrl);
                        } catch (err) {
                          // ignore write errors
                        }
                        // update in-memory stores so other parts of the app use the new avatar immediately
                        try {
                          // @ts-ignore - setState exists on the hook
                          useUserStore.setState({
                            currentUser: {
                              ...(currentUser || {}),
                              avatarUrl: dataUrl,
                            },
                          });
                        } catch (e) {
                          // ignore
                        }
                        try {
                          // @ts-ignore
                          useAuthStore.setState({
                            user: {
                              _id: authUser?._id ?? "",
                              email: authUser?.email ?? "",
                              fullName: authUser?.fullName ?? "",
                              userType: authUser?.userType ?? "client",
                              createdAt: authUser?.createdAt ?? "",
                              updatedAt: authUser?.updatedAt ?? "",
                              profileImage: dataUrl,
                              id: authUser?.id,
                              companyName: authUser?.companyName,
                              profile: authUser?.profile,
                            },
                          });
                        } catch (e) {
                          // ignore
                        }
                      };
                      reader.readAsDataURL(file);
                      // reset input so same file can be chosen again later
                      e.currentTarget.value = "";
                    }}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Avatar
                  </Button>
                  <p className="text-muted-foreground text-xs">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>

              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization Name</Label>
                  <Input
                    id="organization-name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={async () => {
                const fullName = [firstName, lastName]
                  .filter(Boolean)
                  .join(" ");
                const payload = {
                  fullName: fullName || undefined,
                  companyName: organizationName || undefined,
                  profile: {
                    location: location || undefined,
                    skills: skills && skills.length ? skills : undefined,
                  },
                };
                try {
                  const result = await updateMe(payload);
                  if (result) {
                    // Immediately update local form state so the UI reflects saved values
                    const nameParts = (result.fullName || "").split(" ");
                    setFirstName(nameParts.shift() || firstName);
                    setLastName(nameParts.join(" ") || lastName);
                    setEmail(result.email || email);
                    setLocation(result.profile?.location || location);
                    setOrganizationName(result.companyName || organizationName);
                    if (
                      result.profile?.skills &&
                      Array.isArray(result.profile.skills)
                    ) {
                      setSkills(result.profile.skills);
                    }

                    toast.success("Profile updated successfully");
                    // keep router.refresh if server refetch is desired
                    router.refresh();
                  } else {
                    toast.error("Failed to update profile");
                  }
                } catch (err) {
                  toast.error("Failed to update profile");
                }
              }}
              disabled={storeLoading}
            >
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
