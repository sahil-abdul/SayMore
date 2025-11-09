import dbConnection from "@/lib/dbConnection";
import userModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import response from "@/helpers/response";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return response("Not Authenticared", false, 401);
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    // console.log(userId);
    const user = await userModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages" } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user) {
      return response("User not present", false, 404);
    }
    return response("message fetch successFully", true, 200, user[0].messages);
  } catch (error) {
    console.log("error in geting msg", error);
    return response("Fetching msg data got failed", false, 500);
  }
}
