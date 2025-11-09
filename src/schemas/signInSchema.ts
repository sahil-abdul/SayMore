import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const signInSchema = z.object({
    // username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must conatain the 6 charecters" }),
});
