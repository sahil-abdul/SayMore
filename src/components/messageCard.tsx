"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiREsponse";

import { Loader2, X } from "lucide-react";
import { Message } from "@/model/user.model";
import dayjs from "dayjs";

interface MessageProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

function MessageCard({ message, onMessageDelete }: MessageProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/deleteMsg/${message._id}`
      );
      toast(response.data.message);
      onMessageDelete(message._id);
    } catch (error) {
      console.log("error in sigUp the user ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "error in cheking username"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Card className="card-bordered">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{message.content}</CardTitle>
            <Button variant={"destructive"} onClick={handleDelete}>
              {loading ? (
                <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X />
              )}
            </Button>
          </div>
          <div className="text-sm">
            {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default MessageCard;
