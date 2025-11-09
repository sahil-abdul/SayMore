"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyEmailSchema } from "@/schemas/verifyEmailSchema";
import { ApiResponse } from "@/types/ApiREsponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function page() {
  const param = useParams<{ username: string }>();
  const { username } = param;
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState(false);

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: z.infer<typeof verifyEmailSchema>) => {
    try {
      setIsSubmiting(true);
      console.log(data)
      const respone = await axios.post("/api/verifyCode", {
        code: data.code,
        username,
      });
      console.log(respone);
      toast(respone.data?.message);
      router.replace("/signIn");
    } catch (error) {
      console.log("error in verify the user ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "An error occurred. Please try again."
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
            Verify Your <span className="text-sky-400" >Account</span>
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />

                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your Email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" disabled={isSubmiting} className="p-5">
              {isSubmiting ? (
                <span className="flex gap-1">
                  {" "}
                  <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" /> please
                  wait{" "}
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;
