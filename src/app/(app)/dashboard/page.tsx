'use client';
import MessageCard from "@/components/messageCard";
import { acceptmessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiREsponse";
import { toast } from "sonner";
import { Message } from "@/model/user.model";
import { SessionContext, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { Input } from "@/components/ui/input";

function dashboard() {
  const form = useForm<z.infer<typeof acceptmessageSchema>>({
    resolver: zodResolver(acceptmessageSchema),
  });

  // console.log(form);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMssage");
  const { data: session } = useSession();

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptingMsg = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-msg");
      // console.log(response)
      // console.log(response.data?.data?.isAcceptingMsg);
      setValue("acceptMssage", response.data?.data?.isAcceptingMsg ?? false);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.warning(
        axiosError.response?.data?.message || "error in fetching the messge"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsSwitchLoading(false);
      setLoading(true);
      try {
        const response = await axios.post("/api/getMessages");
        setMessages(response.data.data || []);
        if (refresh) {
          toast("refreded messages ");
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast.warning(
          axiosError.response?.data?.message || "error in fetching the messge"
        );
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchAcceptingMsg();
    fetchMessages();
  }, [fetchAcceptingMsg, fetchMessages, session, setValue]);


  //handling the switch toggle
  const handleSwitchToggle = async () => {
    try {
      const response = await axios.post("/api/accept-msg", {
        messageAccept: !acceptMessages,
      });
      console.log(response);
      setValue("acceptMssage", !acceptMessages);
      if (response) {
        toast(response.data.message);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.warning(
        axiosError.response?.data?.message || "error in toggling the message"
      );
    }
  };

  useEffect(() => {
  if (typeof window !== "undefined" && session?.user) {
    const username = (session.user as User)?.username;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    setProfileUrl(`${baseUrl}/saymore/${username}`);
  }
}, [session]);

  
  // const { username } = session?.user as User;
  // const username = (session?.user as User)?.username;

  // // const username = session?.user?.username;


  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  // const profileUrl = `${baseUrl}/saymore/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copy to clipboard");
  };

  if (!session || !session.user) {
    return (
      <>
        <h1>please logIN</h1>
      </>
    );
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <Input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMssage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchToggle}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default dashboard;
