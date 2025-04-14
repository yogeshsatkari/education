"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/card";
import Link from "next/link";
import React, { useEffect } from "react";

import { sendEmail } from "../../../utils/email";
import { authClient } from "../../../utils/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/form";
import { Input } from "../../../components/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type SignUpForm, formSchema } from "../_types/auth-form";

export default function SignUp() {
  const router = useRouter();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpForm) {
    try {
      console.log("valuese: ", values);
      const { name, username, email, password } = values;
      const { data, error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          ...(username ? { username } : {}), // Only include username if it's not empty
        },
        {
          onRequest: () => {
            toast("Signing up...");
          },
          onSuccess: async () => {
            // Send email after successful signup
            try {
              await sendEmail({
                to: email,
                subject: "Welcome to Swarn Foundation",
                text: "Thank you for signing up!",
              });
            } catch (error) {
              console.log("error: ", error);
              console.error("Error sending welcome email:", error);
            }

            // Continue with normal signup flow
            form.reset();
            router.replace("/sign-in");
            toast.dismiss();
            toast("Please verify your email address to sign in.");
          },
          onError: (ctx) => {
            console.log("ctx: ", ctx);

            toast.dismiss(); // Dismiss the "Signing up..." toast
            const errorMessages = {
              USERNAME_IS_TOO_SHORT:
                "Username must be at least 3 characters long",
              USERNAME_IS_INVALID:
                "Username can only contain letters, numbers, and underscores",
              USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER:
                "This username is already taken",
              USER_ALREADY_EXISTS: "An account with this email already exists",
              INVALID_EMAIL: "Please enter a valid email address",
              PASSWORD_TOO_WEAK:
                "Password must be at least 8 characters long with a number and special character",
            };
            const errorMessage = ctx.error?.code
              ? errorMessages[ctx.error.code as keyof typeof errorMessages] ||
                ctx.error?.message
              : "Something went wrong during sign up. Please try again.";
            toast(errorMessage);
          },
        }
      );
    } catch (error: unknown) {
      toast("Failed to create account");
    }
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Sign Up
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Welcome! Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex space-x-4">
                {" "}
                {/* Added flex container */}
                <FormField
                  control={form.control}
                  name="name" // Keep this for full name
                  render={({ field }) => (
                    <FormItem className="flex-[5.5]">
                      {" "}
                      {/* Added flex-1 for equal width */}
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          autoComplete="name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username" // New field for username
                  render={({ field }) => (
                    <FormItem className="flex-[4.5]">
                      {" "}
                      {/* Added flex-1 for equal width */}
                      <FormLabel>Username (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="john77" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@gmail.com"
                        {...field}
                        autoComplete="email"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        autoComplete="new-password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>{" "}
        </CardFooter>
      </Card>
    </>
  );
}
