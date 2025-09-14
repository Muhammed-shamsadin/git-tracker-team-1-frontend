import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "react-day-picker";
import { useForm } from "react-hook-form";
import z from "zod";

const ProfileSchema = z.object({
  profileImage: z.string().url().optional(),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  organizationName: z.string().optional(),
});

export type ProfileFormType = z.infer<typeof ProfileSchema>;

export function ProfileForm({
  user,
  onSubmit,
}: {
  user: any;
  onSubmit: (data: ProfileFormType) => void;
}) {
  // Map backend user data to form fields
  let firstName = "";
  let lastName = "";
  if (user.fullName) {
    const parts = user.fullName.split(" ");
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }
  const location = user.profile?.location || "";
  const profileImage = user.profileImage || "";
  // phone and organizationName are not present in your backend data

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      profileImage,
      firstName,
      lastName,
      location,
      phone: "",
      organizationName: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={
              form.watch("profileImage") ||
              "/placeholder.svg?height=80&width=80"
            }
            alt="User Avatar"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Input
          {...form.register("profileImage")}
          placeholder="Profile Image URL"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...form.register("firstName")} placeholder="First Name" />
        <Input {...form.register("lastName")} placeholder="Last Name" />
      </div>
      {/* <Input {...form.register("phone")} placeholder="Phone Number" /> */}
      <Input {...form.register("location")} placeholder="Location" />
      {/* <Input
        {...form.register("organizationName")}
        placeholder="Organization Name"
      /> */}
      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
