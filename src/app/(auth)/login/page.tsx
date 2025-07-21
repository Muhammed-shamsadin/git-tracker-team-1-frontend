"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/validations/authValidations";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FaGoogle, FaGithub, FaSpinner } from "react-icons/fa";

export default function LoginPage() {
    const [isLoading, setIsLoading] = React.useState(false);
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        toast(
            <pre className="bg-slate-950 mt-2 p-4 rounded-md w-[340px]">
                <code className="text-white">
                    {JSON.stringify(values, null, 2)}
                </code>
            </pre>
        );
        try {
            setTimeout(() => {
                if (values.email === "fail@example.com") {
                    toast.error("Invalid credentials. Please try again.");
                    setIsLoading(false);
                } else {
                    window.location.href = "/dashboard";
                }
            }, 2000);
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-gradient-to-br from-background to-muted p-4 min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center bg-primary mx-auto mb-4 rounded-lg w-12 h-12 text-primary-foreground">
                        <GitFork className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your GitTracker account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form
                            className="space-y-4"
                            onSubmit={form.handleSubmit(onSubmit)}
                            aria-label="Login form"
                        >
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                autoComplete="email"
                                                aria-label="Email"
                                                {...field}
                                                disabled={isLoading}
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
                                        <FormLabel htmlFor="password">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                id="password"
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                                aria-label="Password"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Remember Me Checkbox */}
                            <FormField
                                control={form.control}
                                name="remember"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                id="remember"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormLabel
                                            htmlFor="remember"
                                            className="font-normal text-sm"
                                        >
                                            Remember me
                                        </FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="flex justify-center items-center w-full"
                                disabled={isLoading || !form.formState.isValid}
                                aria-busy={isLoading}
                            >
                                {isLoading && (
                                    <FaSpinner
                                        className="mr-2 w-4 h-4 text-white animate-spin"
                                        size={24}
                                    />
                                )}
                                {isLoading ? "Signing in..." : "Sign In"}
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

                    <div className="gap-4 grid grid-cols-2">
                        <Button
                            variant="outline"
                            className="bg-transparent w-full"
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            aria-label="Sign in with Google"
                        >
                            <FaGoogle className="mr-2 w-4 h-4" />
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-transparent w-full"
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            aria-label="Sign in with GitHub"
                        >
                            <FaGithub className="mr-2 w-4 h-4" />
                            GitHub
                        </Button>
                    </div>

                    <div className="text-sm text-center">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
