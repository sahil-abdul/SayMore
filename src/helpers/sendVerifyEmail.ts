import { resend } from "@/lib/resendEmail";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiREsponse";


export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
   
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "SayMore || verify email code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "email send successFully" };
  } catch (emailError) {
    console.log("error in sending email ", emailError);
    return { success: false, message: "sending email get failed" };
  }
}
