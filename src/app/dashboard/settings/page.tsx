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
import {
  Plus,
  Save,
  Github,
  Linkedin,
  Twitter,
  Trash2,
  RotateCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const router = useRouter();

  const { currentUser, updateMe, isLoading: storeLoading } = useUserStore();
  const { user: authUser, checkAuth } = useAuthStore();

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

  // Ensure authStore.user is fresh whenever Settings mounts
  useEffect(() => {
    checkAuth().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // populate local state from auth user (preferred) or currentUser when available
  useEffect(() => {
    const applyFrom = (u: any) => {
      const fullNameStr = u?.fullName || "";
      const nameParts = fullNameStr.split(" ");
      const f = nameParts.shift() || "";
      const l = nameParts.join(" ") || "";
      const em = u?.email || "";
      const pn =
        u?.phoneNumber ?? u?.profile?.phoneNumber ?? u?.profile?.phone ?? u?.phone ?? "";
      const loc = u?.profile?.location || "";
      const org = u?.companyName || "";
      const skl = Array.isArray(u?.profile?.skills) ? u.profile.skills : undefined;

      if (f && f !== firstName) setFirstName(f);
      if (l && l !== lastName) setLastName(l);
      if (em && em !== email) setEmail(em);
      if (pn && pn !== phone) setPhone(pn);
      if (loc && loc !== location) setLocation(loc);
      if (org && org !== organizationName) setOrganizationName(org);
      if (skl && JSON.stringify(skl) !== JSON.stringify(skills)) setSkills(skl);
    };

    if (authUser) {
      applyFrom(authUser);
    } else if (currentUser) {
      applyFrom(currentUser);
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

  // Recycle bin state (inline in settings tab)
  type RecycleItem = {
    id: string;
    name: string;
    deletedAt: string;
  };

  const [recycleItems, setRecycleItems] = useState<RecycleItem[]>([]);
  const [recycleLoading, setRecycleLoading] = useState(false);

  const [recycleQuery, setRecycleQuery] = useState("");

  const filteredRecycle = recycleItems.filter((i) =>
    `${i.name}`.toLowerCase().includes(recycleQuery.toLowerCase())
  );

  // Load archived/deleted projects from the server
  useEffect(() => {
    let mounted = true;
    const loadDeleted = async () => {
      setRecycleLoading(true);
      try {
        // dynamic import to avoid adding api import at top if unused elsewhere
        const { default: api } = await import("@/lib/axios");
        const res = await api.get("/projects/deleted");
        const data = res.data.data || res.data;
        // normalize to RecycleItem shape where possible
        const items: RecycleItem[] = (
          Array.isArray(data) ? data : data.projects || []
        ).map((p: any) => ({
          id: p._id || p.id,
          name: p.name || p.title || `Project ${p._id || p.id}`,
          deletedAt: p.deletedAt || p.archivedAt || p.deleted_at || "",
        }));
        if (mounted) setRecycleItems(items);
      } catch (err) {
        // ignore fetch errors for now
      } finally {
        if (mounted) setRecycleLoading(false);
      }
    };
    loadDeleted();
    return () => {
      mounted = false;
    };
  }, []);

  // Restore an archived project via the server and refresh project lists
  const restoreRecycleItem = async (id: string) => {
    setRecycleLoading(true);
    try {
      const { default: api } = await import("@/lib/axios");
      const res = await api.patch(`/projects/${id}/restore`);
      const data = res.data.data || res.data;
      // optimistically remove from UI
      setRecycleItems((s) => s.filter((i) => i.id !== id));

      // refresh project lists in the store so restored project appears
      try {
        const { useProjectStore } = await import("@/stores/projectStore");
        // call multiple fetchers to cover different role views
        const store = useProjectStore.getState();
        // best-effort refresh
        store.fetchAllProjects().catch(() => {});
        store.fetchClientProjects().catch(() => {});
        store.fetchDeveloperProjects().catch(() => {});
      } catch (e) {
        // ignore errors from store refresh
      }

      toast.success("Item restored");
    } catch (err) {
      toast.error("Failed to restore item");
    } finally {
      setRecycleLoading(false);
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
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          <TabsTrigger value="recyclebin">Recycle Bin</TabsTrigger>
          {/* <TabsTrigger value="appearance">Appearance</TabsTrigger> */}
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
                const fullName = [firstName, lastName].filter(Boolean).join(" ");
                const payload = {
                  fullName: fullName || undefined,
                  companyName: organizationName || undefined,
                  phoneNumber: phone || undefined,
                  profile: {
                    location: location || undefined,
                    skills: skills && skills.length ? skills : undefined,
                  },
                };
                try {
                  const result: any = await updateMe(payload);
                  if (result) {
                    // Use submitted values to ensure UI reflects latest changes immediately
                    setFirstName(firstName);
                    setLastName(lastName);
                    setEmail(result.email || email);
                    setPhone(phone);
                    setLocation(location);
                    setOrganizationName(organizationName);
                    if (skills && Array.isArray(skills)) {
                      setSkills(skills);
                    }

                    // Merge into auth store so other pages and hydration read latest data
                    try {
                      // Build a merged user prioritizing submitted values, then API result, then previous authUser
                      const prev = (useAuthStore.getState() as any).user || {};
                      const merged = {
                        ...prev,
                        ...result,
                        fullName: fullName || result?.fullName || prev?.fullName,
                        companyName: organizationName || result?.companyName || prev?.companyName,
                        phoneNumber: phone || result?.phoneNumber || prev?.phoneNumber,
                        profile: {
                          ...(prev?.profile || {}),
                          ...(result?.profile || {}),
                          location: location || result?.profile?.location || prev?.profile?.location,
                          skills: (skills && skills.length ? skills : (result?.profile?.skills || prev?.profile?.skills)) || [],
                        },
                      };
                      // @ts-ignore zustand setState is available
                      useAuthStore.setState({ user: merged });
                    } catch {}

                    toast.success("Profile updated successfully");
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
        {/* <TabsContent value="notifications">
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
        </TabsContent> */}

        {/* RECYCLE BIN */}
        <TabsContent value="recyclebin">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recycle Bin Settings</h2>
                <p className="text-muted-foreground">
                  Configure your recycle bin settings.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Input
                placeholder="Search deleted items"
                value={recycleQuery}
                onChange={(e) => setRecycleQuery(e.target.value)}
              />
              <div className="text-sm text-muted-foreground">
                {recycleItems.length} deleted items
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Deleted Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-muted/40 text-sm font-medium">
                    <div className="col-span-6">Name</div>
                    <div className="col-span-3">Deleted At</div>
                    <div className="col-span-1">Deleted</div>
                  </div>
                  <div className="divide-y">
                    {filteredRecycle.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 items-center gap-4 p-3"
                      >
                        <div className="col-span-6 flex items-center gap-2">
                          <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {item.name}{" "}
                              <span className="ml-2 text-xs py-0.5 px-2 rounded bg-slate-100 text-muted-foreground"></span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3 text-sm text-muted-foreground">
                          {item.deletedAt}
                        </div>
                        <div className="col-span-1 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreRecycleItem(item.id)}
                            >
                              <RotateCw className="mr-2 w-4 h-4" />
                              Restore
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* APPEARANCE */}
        {/* <TabsContent value="appearance">
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
