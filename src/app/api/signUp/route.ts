import { sendVerificationEmail } from "@/helpers/sendVerifyEmail";
import userModel from "@/model/user.model";
import dbConnection from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import response from "@/helpers/response";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return response("please provide all the feilds",false,400)
    }

    const isUserNameExsit = await userModel.findOne({
      username,
      isVerify: true,
    });
    
    if (isUserNameExsit) {
      return Response.json(
        {
          success: false,
          message: "user already exist",
        },
        {
          status: 400,
        }
      );
    }
    
    const isUserEmailExist = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const expiryData = new Date();
    expiryData.setHours(expiryData.getHours() + 1);

    if (isUserEmailExist) {
      if (isUserEmailExist.isVerify) {
        return Response.json(
          {
            success: false,
            message: "email already Taken, you another email",
          },
          {
            status: 400,
          }
        );
      } else {
        isUserEmailExist.password = hashPassword;
        isUserEmailExist.verifyCode = verifyCode;
        isUserEmailExist.verifyCodeExpiry = expiryData;

        await isUserEmailExist.save();
      }
    } else {
      const user = new userModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryData,
        isVerify: false,
        isMsgAccept: true,
        messages: [],
      });
      await user.save();
    }
    const verificationEamilStatus = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    // console.log(verificationEamilStatus)

    if (!verificationEamilStatus.success) {
      return Response.json(
        {
          success: false,
          message:
            verificationEamilStatus.message ||
            "Failed to send verification email",
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "user register successFully please verify your email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("error during sending user signUp");
    return Response.json(
      {
        success: false,
        message: "registration failed",
      },
      {
        status: 500,
      }
    );
  }
}
