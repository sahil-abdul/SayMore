import { z } from "zod";

export const acceptmessageSchema = z.object({
  acceptMssage: z.boolean(),
});
