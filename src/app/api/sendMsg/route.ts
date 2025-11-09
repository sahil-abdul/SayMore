import dbConnection from "@/lib/dbConnection";
import userModel from "@/model/user.model";
import response from "@/helpers/response";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, content } = await request.json();
    if (!username || !content) {
      return response("please provide all the feilds", false, 400);
    }
    const user = await userModel.findOne({ username });
    if (!user) {
      return response("User not found", false, 404);
    }
    const isUserExseptingMsg = user.isMsgAccept;
    if (!isUserExseptingMsg) {
      return response("User is not accepting messages", false, 403);
    }

    user.messages.push({ content, createdAt: new Date() } as Message);
    await user.save();

    return response("message send successFully", true, 200);
  } catch (error) {
    console.log("error in sending messges", error);
    return response("Sending msg failed", false, 500);
  }
}
