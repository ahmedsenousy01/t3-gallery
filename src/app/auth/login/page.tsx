"use client";

import Link from "next/link";
import type * as z from "zod";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { credentialsSignIn, providerSignIn } from "~/server/auth/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "~/schemas";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      switch (oauthError) {
        case "OAuthAccountNotLinked":
          setApiError(
            "This account is already registered with a different provider"
          );
          break;
        case "OauthInvalidToken":
          setApiError("Invalid token");
          break;
        default:
          setApiError("Unknown error");
      }
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const res = await credentialsSignIn({
      credentials: values,
      redirectTo: searchParams.get("callbackUrl") ?? "/",
    });
    if (res?.error) {
      setApiError(res?.error);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          {apiError && (
            <p className="text-sm font-medium text-destructive">{apiError} </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage className="max-w-[250px] break-words" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Link
                            href="#"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage className="max-w-[250px] break-words" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="flex w-full justify-between">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={async () => await providerSignIn("google")}
                  >
                    Login with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={async () => await providerSignIn("github")}
                  >
                    Login with Github
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="underline">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
