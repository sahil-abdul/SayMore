import userModel from "@/model/user.model";
import dbConnection from "@/lib/dbConnection";
import { verifyEmailSchema } from "@/schemas/verifyEmailSchema";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, code } = await request.json();
    console.log({ username, code });
    const decodedUsername = decodeURIComponent(username); //remove the blank spaces and makeit valid username

    // const result = verifyEmailQuerySchema.safeParse(code);
    // console.log(result);
    // if (!result.success) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message:
    //         "invalid OTP or username, otp must contain 6 charecter or usernane not conatin any special charecter",
    //     },
    //     {
    //       status: 400,
    //     }
    //   );
    // }
    const user = await userModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "invalid username",
        },
        {
          status: 404,
        }
      );
    }

    const isValidCode = user.verifyCode === code;
    const inValidTime = new Date(user.verifyCodeExpiry) > new Date();

    if (isValidCode && inValidTime) {
      user.isVerify = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "you are now verified",
        },
        {
          status: 200,
        }
      );
    } else if (!isValidCode) {
      return Response.json(
        {
          success: false,
          message: "invalid OTP",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "varify code is expire please re signUp and get new OTP",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error: any) {
    console.log("error in checking very the user || ", error);
    return Response.json(
      {
        success: false,
        message: "user validation failed",
      },
      {
        status: 500,
      }
    );
  }
}
