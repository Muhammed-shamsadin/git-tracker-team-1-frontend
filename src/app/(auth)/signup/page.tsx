"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FaGoogle, FaGithub, FaSpinner } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import { RegisterData, RegisterSchema } from "@/types/Auth";

export default function SignUpPage() {
    const { register, isLoading } = useAuthStore();

    const form = useForm<RegisterData>({
        resolver: zodResolver(RegisterSchema),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            userType: "client",
        },
    });

    const onSubmit = async (values: RegisterData) => {
        try {
            await register(values);
            toast.success("User registered successfully!");
            window.location.href = "/login";
        } catch (error) {
            toast.error("Signup failed! Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center bg-gradient-to-br from-background to-muted p-4 min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center bg-primary mx-auto mb-4 rounded-lg w-12 h-12 text-primary-foreground">
                        <GitFork className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">
                        Create your account
                    </CardTitle>
                    <CardDescription>
                        Join GitTracker and start managing your repositories
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                            aria-label="Signup form"
                        >
                            {/* Full Name Field */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="Enter your full name"
                                                {...field}
                                                aria-label="Full Name"
                                                autoComplete="name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                {...field}
                                                aria-label="Email"
                                                autoComplete="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                id="password"
                                                placeholder="Create a password"
                                                {...field}
                                                aria-label="Password"
                                                autoComplete="new-password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* User Type Tabs */}
                            <FormField
                                control={form.control}
                                name="userType"
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <FormLabel>Account Type</FormLabel>
                                        <Tabs
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <TabsList className="grid grid-cols-2 w-full">
                                                <TabsTrigger value="client">
                                                    Client
                                                </TabsTrigger>
                                                <TabsTrigger value="developer">
                                                    Developer
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent
                                                value="client"
                                                className="mt-2"
                                            >
                                                <p className="text-muted-foreground text-sm">
                                                    I'm looking to hire
                                                    developers or manage
                                                    projects
                                                </p>
                                            </TabsContent>
                                            <TabsContent
                                                value="developer"
                                                className="mt-2"
                                            >
                                                <p className="text-muted-foreground text-sm">
                                                    I'm a developer looking to
                                                    work on projects
                                                </p>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="flex justify-center items-center w-full"
                                disabled={isLoading}
                                aria-busy={isLoading}
                            >
                                {isLoading && (
                                    <FaSpinner
                                        className="mr-2 w-4 h-4 text-white animate-spin"
                                        size={24}
                                    />
                                )}
                                {isLoading ? "Creating..." : "Create Account"}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="gap-4 grid grid-cols-2">
                        <Button
                            variant="outline"
                            className="bg-transparent w-full"
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            aria-label="Sign up with Google"
                        >
                            <FaGoogle className="mr-2 w-4 h-4" />
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-transparent w-full"
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            aria-label="Sign up with GitHub"
                        >
                            <FaGithub className="mr-2 w-4 h-4" />
                            GitHub
                        </Button>
                    </div>

                    <div className="text-sm text-center">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Log in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
