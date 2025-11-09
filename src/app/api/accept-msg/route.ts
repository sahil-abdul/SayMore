import dbConnection from "@/lib/dbConnection";
import userModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import response from "@/helpers/response";

export async function POST(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return response("Not Authenticated", false, 401);
  }
  const userId = user._id;
  try {
    const { messageAccept }: { messageAccept: boolean } = await request.json();
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          isMsgAccept: messageAccept,
        },
        {
          new: true,
        }
      )
      .select("-password -verifyCode -isVerify -verifyCodeExpiry");

    if (!updatedUser) {
      return response("user not found", false, 404);
    }

    return response("message toggle successFully", true, 200, updatedUser);
  } catch (error) {
    console.log("error in toggling the meg status ", error);
    return response("error in toglling message", false, 500);
  }
}

export async function GET(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return response("Not Authenticated", false, 401);
  }
  const userId = user._id;

  try {
    const isValidUser = await userModel.findById(userId);

    if (!isValidUser) {
      return response("user not found", false, 404);
    }

    return response("message data fetch succesFully", true, 200, {
      isAcceptingMsg: isValidUser.isMsgAccept,
    });
  } catch (error) {
    console.log("error in geting the meg status ", error);
    return response("error in fecting message status", false, 500);
  }
}
