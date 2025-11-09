import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerify?: boolean;
    isMsgAccept?: boolean;
    username?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isVerify?: boolean;
      isMsgAccept?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

//another way to declare the interface for the options.ts

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerify?: boolean;
    isMsgAccept?: boolean;
    username?: string;
  }
}
