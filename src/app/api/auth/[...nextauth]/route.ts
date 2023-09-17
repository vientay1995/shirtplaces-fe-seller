import { AxiosError } from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const payload = {
            username: credentials?.username,
            password: credentials?.password,
          };

          const user = { id: "1", name: "Admin", email: "admin@admin.com", ...payload };

          return user;
        } catch (error: any) {
          if (error instanceof AxiosError) throw Error(error?.message);
          throw Error(error);
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token, user }) {
      console.log({ token, user });
      return session; // The return type will match the one returned in `useSession()`
    },
  },
});

export { handler as GET, handler as POST };
