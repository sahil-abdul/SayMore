import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be of 2 character")
  .max(10, "username can contain only 10 charecters")
  .regex(/^[a-zA-Z][a-zA-Z0-9-_]{1,9}$/, "invalid username");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email" }),
  password: z
    .string()
    .min(6, { message: "password need minimum 6 charecters" }),
});
