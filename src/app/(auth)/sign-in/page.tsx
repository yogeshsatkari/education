"use client";
import {
  Card,
  CardContent,

  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/card";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { signInFormSchema } from "@/app/(auth)/_types/auth-form";
import { authClient } from "@/utils/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/button";
import {
  Form,
  FormControl,

  FormField,
  FormItem,
 
  FormMessage,
} from "../../../components/form";
import { Input } from "../../../components/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SignInForm = z.infer<typeof signInFormSchema>;

const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data) {
          console.log("session: ", session);
          router.replace("/dashboard");
        }
      } catch (error) {
        // Ignore auth check errors - user will need to sign in
      }
    };

    checkAuth();

    try {
      authClient.oneTap({
        callbackURL: "/dashboard",
        // for soft redirect
        // fetchOptions: {
        //   onSuccess: () => {
        //     router.push("/dashboard");
        //   }
        // }
      });
    } catch (error: unknown) {
      toast.error("Failed to initialize One Tap sign-in");
    }
  }, []);

  async function onSubmit(values: SignInForm) {
    const { identifier, password } = values;

    try {
      setLoading(true);
      // Check if the identifier is an email
      const isEmail = identifier.includes("@");
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let data: any;

      if (isEmail) {
        // Call the existing sign-in method for email
        data = await authClient.signIn.email(
          {
            email: identifier,
            password,
            // callbackURL: "/dashboard", // works, but not using it
            rememberMe: true,
          },
          {
            onRequest: () => {
              // toast("Please wait...");
            },
            onSuccess: () => {
              form.reset();
              router.replace("/dashboard");
              toast.dismiss();
              toast("Sign in successful!");
            },
            onError: (ctx) => {
              toast.dismiss();
              const errorMessages = {
                // INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
                EMAIL_NOT_VERIFIED: "Please verify your email address.",
              };
              const errorMessage = ctx.error?.code
                ? errorMessages[ctx.error.code as keyof typeof errorMessages] ||
                  ctx.error?.message
                : "Something went wrong during sign in.";
              toast(errorMessage);
            },
          }
        );
      } else {
        // Call the sign-in method for username
        data = await authClient.signIn.username(
          {
            username: identifier,
            password,
            rememberMe: true,
          },
          {
            onRequest: () => {
              // toast("Please wait...");
            },
            onSuccess: () => {
              form.reset();
              router.replace("/dashboard");
              toast.dismiss();
              toast("Sign in successful!");
            },
            onError: (ctx) => {
              toast.dismiss();
              toast(ctx.error?.message || "Something went wrong");
            },
          }
        );
      }
    } catch (error) {
      toast.error("Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      const { data, error } = await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {},
          onSuccess: () => {
            form.reset();
          },
          onError: (ctx) => {
            toast.dismiss();
            if (ctx.error?.code === "POPUP_CLOSED") {
              toast("Google sign in was cancelled");
            } else {
              toast(ctx.error?.message || "Failed to sign in with Google");
            }
          },
        }
      );
    } catch (error: unknown) {
      toast.error("Failed to sign in with Google.");
    }
  }

  async function signInWithApple() {
    try {
      const { data, error } = await authClient.signIn.social(
        {
          provider: "apple",
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {},
          onSuccess: () => {
            form.reset();
          },
          onError: (ctx) => {
            toast.dismiss();
            if (ctx.error?.code === "POPUP_CLOSED") {
              toast("Apple sign in was cancelled");
            } else {
              toast(ctx.error?.message || "Failed to sign in with Apple");
            }
          },
        }
      );
    } catch (error: unknown) {
      toast.error("Failed to sign in with Apple.");
    }
  }

  async function handleForgetPassword() {
    const email = form.getValues("identifier"); // Get the email from the form
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");
    const hasConsecutiveDots = email.includes("..");
    if (
      email.split("@").length - 1 !== 1 || // Ensures there is exactly one '@'
      atIndex <= 0 || // Ensures '@' exists and has characters before it
      dotIndex <= atIndex + 1 || // Ensures '.' comes after '@' with at least one character between them
      dotIndex === email.length - 1 || // Ensures there are characters after the last '.'
      hasConsecutiveDots // Ensures there are no consecutive dots
    ) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });
      toast.success("Check your email for a password reset link.");
    } catch (error) {
      toast.error("Failed to send password reset email.");
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Sign In
        </CardTitle>
        {/* <CardDescription className="text-sm text-muted-foreground">
          Welcome back! Sign in to your account.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="on"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username or Email"
                      {...field}
                      type="text"
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                  <button
                    type="button"
                    onClick={handleForgetPassword}
                    className="text-xs text-muted-foreground hover:text-primary"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="relative flex justify-center text-xs">
            <span className="px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        {/* <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-white hover:bg-gray-100 text-black dark:text-black border border-gray-300 flex items-center justify-center transition-colors duration-200 active:scale-[0.99]"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <GoogleIcon />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-white hover:bg-gray-100 text-black dark:text-black border border-gray-300 flex items-center justify-center transition-colors duration-200 active:scale-[0.99]"
            onClick={signInWithApple}
            disabled={loading}
          >
            <AppleIcon />
            Apple
          </Button>
        </div> */}
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white hover:bg-gray-50 text-black dark:text-black border border-gray-300 flex items-center justify-center gap-2"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
        {/* <Button
          type="button"
          variant="outline"
          className="w-full bg-white hover:bg-gray-50 text-black dark:text-black border border-gray-300 flex items-center justify-center gap-2"
          onClick={signInWithApple}
          disabled={loading}
        >
          <AppleIcon />
          Continue with Apple
        </Button> */}
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
