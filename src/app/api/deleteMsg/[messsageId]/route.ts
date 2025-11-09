import dbConnection from "@/lib/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import response from "@/helpers/response";
import userModel from "@/model/user.model";

export async function DELETE(
  request: Request,
  { params }: { params: { messsageId: string } }
) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return response("please log in", false, 401);
  }

  try {
    const msgId = await params.messsageId;

    const updatedUser = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: msgId } } }
    );

    if (!updatedUser) {
      return response("message not found or already deleted", false, 404);
    }

    return response("message deleted succesfully", true, 200);
  } catch (error) {
    console.log("error in deleteing msg", error);
    return response("deleteing msg data got failed", false, 500);
  }
}
