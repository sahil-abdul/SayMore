import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/dbConnection";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnection();

        try {
          const user = await userModel.findOne(
            { email: credentials.email }
            //   { username: credentials.indentifier.username },
          );

          if (!user) {
            console.log("user not exsit");
            throw new Error("user does not exist");
          }

          if (!user.isVerify) {
            console.log("verify email");
            throw new Error("plaese verify your email");
          }

          const isValidPass = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isValidPass) {
            return {
              _id: user._id?.toString(),
              username: user.username,
              isVerify: user.isVerify,
              isMsgAccept: user.isMsgAccept,
              email: user.email,
            };
          } else {
            console.log("invalid password");
            throw new Error("incorrect password");
          }
        } catch (error: any) {
          console.log("error in authOptins");
          throw new Error(error.message || "Something went wrong during login");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // first login
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerify = user.isVerify;
        token.isMsgAccept = user.isMsgAccept;
      }
      // subsequent requests, just return the token as-is
      return token;
      // token._id = user._id?.toString();
      // token.isVerify = user.isVerify;
      // token.isMsgAccept = user.isMsgAccept;
      // token.username = user.username;
      // return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerify = token.isVerify;
        session.user.isMsgAccept = token.isMsgAccept;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
