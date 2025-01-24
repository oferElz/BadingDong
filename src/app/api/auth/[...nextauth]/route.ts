import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/database";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // 1) Check if we even have username/password
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Missing username or password");
          }

          // 2) Connect to Mongo (via Mongoose)
          await connectToDB();
          const db = mongoose.connection.useDb("BA-DINGDONG-DB");

          // 3) Find user in the DB
          const usersCollection = db.collection("users");
          const user = await usersCollection.findOne({
            username: credentials.username,
            password: credentials.password, // In production, store hashed passwords
          });

          // 4) If no user found, throw (NextAuth will see this as an auth error)
          if (!user) {
            throw new Error("Invalid credentials");
          }

          // 5) Return the user object NextAuth will store in the JWT
          return {
            id: user.id, // or _id.toString() if you need the actual Mongo _id
            role: user.role,
          };
        } catch (err) {
          // This error surfaces to NextAuth, which can show an error page or redirect
          console.error("Next Auth - Authorize error:", err);
          throw new Error("Next Auth - Authorize: Authentication error");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // or wherever your custom sign-in page is
  },
});

export { handler as GET, handler as POST };
