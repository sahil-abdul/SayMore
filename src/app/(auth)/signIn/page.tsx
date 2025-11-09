"use client";
import React, { useEffect, useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/schemas/signInSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiREsponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

function page() {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      // username: "",
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   const cheeckIsUsernameIsUnique = async () => {
  //     if (debouncedValue) {
  //       setUsernameMsg("");
  //       setIsCheckingUsername(true);
  //       try {
  //         const respone = await axios.get(
  //           `/api/isUniqueUsername?username=${debouncedValue}`
  //         );
  //         setUsernameMsg(respone.data.message);
  //       } catch (error) {
  //         const axiosError = error as AxiosError<ApiResponse>;
  //         setUsernameMsg(
  //           axiosError.response?.data.message || "error in cheking username"
  //         );
  //       } finally {
  //         setIsCheckingUsername(false);
  //       }
  //     }
  //   };

  //   cheeckIsUsernameIsUnique();
  // }, [debouncedValue]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
  
    setIsSubmiting(true);
    const response = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    console.log(response);
    if (response?.error) {
      if (response.error === "CredentialsSignin") {
        toast.error("Incorrect username or password");
      } else {
        toast.error(response.error);
      }
    }

    if(response?.url){
      toast("loginSuccess fully")
      router.replace("/dashboard")
    }

    setIsSubmiting(false);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to <span className="text-sky-400">SayMore</span>
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Eamil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmiting} className="p-5">
              {isSubmiting ? (
                <span className="flex gap-2">
                  <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" /> please
                  wait{" "}
                </span>
              ) : (
                "signIn"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have account?{" "}
            <Link href="/signUp" className="text-sky-400 hover:text-cyan-400">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
