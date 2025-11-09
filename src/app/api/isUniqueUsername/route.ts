import userModel from "@/model/user.model";
import dbConnection from "@/lib/dbConnection";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameValidationQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
 
  await dbConnection();
  try {
    const { searchParams } = new URL(request.url);
    const querParam = {
      username: searchParams.get("username"),
    };

    const result = usernameValidationQuerySchema.safeParse(querParam);
    // console.log(result.error);
    if (!result.success) {
      const querErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          message:
            querErrors.length > 0
              ? querErrors.join(", ")
              : "invalid querparameter",
          success: false,
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;

    const isUserPresent = await userModel.findOne({ username, isVerify: true });

    if (isUserPresent) {
      return Response.json(
        {
          message: "uername already exsit",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        message: "username is unique",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("error in checking unique username unique or not || ", error);
    return Response.json(
      {
        success: false,
        message: "username validation failed",
      },
      {
        status: 500,
      }
    );
  }
}
