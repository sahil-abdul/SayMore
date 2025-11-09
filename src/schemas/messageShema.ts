import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "msg contain at least 10 charecter" })
    .max(300, { message: "msg conatain only 50 charecters" }),

  
});
