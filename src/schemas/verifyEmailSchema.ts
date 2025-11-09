import { z } from "zod";

export const verifyEmailSchema = z.object({
  code: z.string().min(6, "verifyEmail code must contain the 6 charecters"),
});
