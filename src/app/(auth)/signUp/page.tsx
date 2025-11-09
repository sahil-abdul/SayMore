"use client";
import React, { useEffect, useState } from "react";
import {useDebounceCallback  } from "usehooks-ts";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiREsponse";
import { signUpSchema } from "@/schemas/signUpSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


function page() {
  const [username, setUsername] = useState("");
  const [UsernameMsg, setUsernameMsg] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const cheeckIsUsernameIsUnique = async () => {
        
      if (username) {
        setUsernameMsg("");
        setIsCheckingUsername(true);
        try {
          const respone = await axios.get(
            `/api/isUniqueUsername?username=${username}`
          );
          setUsernameMsg(respone.data.message);
          
        //   console.log(UsernameMsg)
        } catch (error) {
            console.log(error)
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMsg(
            axiosError.response?.data.message || "error in cheking username"
          );
          toast.error(axiosError.response?.data.message)
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    cheeckIsUsernameIsUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmiting(true);
      const response = await axios.post("/api/signUp", data);
      toast.success(response.data?.message);
      router.replace(`/verifyEmail/${username}`);
    } catch (error) {
      console.log("error in sigUp the user ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "error in cheking username"
      );
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join <span className="text-sky-400" >SayMore</span>
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" />}
                 <p
                      className={`text-sm ${
                        UsernameMsg === 'username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {UsernameMsg}
                    </p>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" /> please wait </span> ) : ("sigup")} 
          </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/signIn" className="text-sky-400 hover:text-cyan-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
