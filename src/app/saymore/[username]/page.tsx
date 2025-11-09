"use client";
import { messageSchema } from "@/schemas/messageShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Loader2, RefreshCcw, List } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiREsponse";
import { toast } from "sonner";

function page() {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const defaultMessages =
    "What’s something small that always makes your day better?||If you could instantly master any skill, what would it be and why?||What’s a place you’ve never been but have always wanted to explore?";

  const params = useParams<{ username: string }>();
  const { username } = params;
  const [refresh, setRefresh] = useState(false);
  // const [aiMessage, setAiMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const { register, handleSubmit,setValue,watch ,reset} = form;
  const aiMessage = watch("content")
  const [messages, setMessages] = useState<string[]>(
    defaultMessages.split("||")
  );

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setSendingMsg(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sendMsg", {
        username,
        content: data.content,
      });
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.warning(
        axiosError.response?.data?.message || "Error in sending messages"
      );
    } finally {
      setSendingMsg(false);
      reset()
    }
  };

  const fetchMsg = async () => {
    try {
      setRefresh(true);
      const response = await axios.post("/api/suggestMsg");
      if (response) {
        const msgs = response.data.summary.split("||");
        setMessages(msgs);
      }
      toast.success("New message suggested!");
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.warning(
        axiosError.response?.data?.message || "error in rfreshing messages"
      );
    } finally {
      setRefresh(false);
    }
  };

  return (
    <div className="w-full p-2 flex flex-col items-center ">
      <h1 className="text-4xl font-bold mt-10">Public Profile Link</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-4/5 md:w-3/5  flex flex-col  m-5"
      >
        <Label htmlFor="message" className="text-md m-3">
          Send Anonymous Message to @{username}
        </Label>
        <Textarea
         
          id="message"
          placeholder="write your anonymous message here"
          className="resize-none rounded-md border-black border-2"
          {...register("content", { required: true })}
        />

        <Button className="m-5 self-center p-4" type="submit" disabled = {sendingMsg}>
          {sendingMsg ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> please wait
            </>
          ) : (
            "Send it"
          )}
        </Button>

        {/* <input type="submit" /> */}
      </form>

      <div className="m-3 p-3 w-4/5 md:w-3/5">
        <p className="text-lg">Click on any message below to select it.</p>
        <div className="border rounded-md border-gray-400 flex flex-col gap-4 p-4 m-2">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button className="mt-4" variant="outline" onClick={fetchMsg}>
              {refresh ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>
          {messages.map((msg, index) => (
            <Button
              key={index + 1}
              className="h-auto w-full border rounded-md border-gray-600 bg-white text-black text-sm p-2 hover:bg-cyan-100 whitespace-normal break-words"
              onClick={() => setValue("content", msg)}
            >
              {msg}
            </Button>
          ))}
        </div>
      </div>
      <Separator />
      <div className="m-3 flex flex-col justify-center items-center gap-3">
        <p className="text-lg">Get Your Message Board</p>
        <Link href={"/dashboard"}>
          <Button className="text-lg">Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default page;
