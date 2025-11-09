import { Message } from "@/model/user.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMsg?: boolean;
  Messages?: Array<Message>;
}
