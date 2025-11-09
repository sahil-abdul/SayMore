import { authOptions } from "./options";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };

