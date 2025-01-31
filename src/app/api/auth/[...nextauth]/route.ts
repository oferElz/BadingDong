import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

// This is NextAuth configuration for handling user authentication
const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // Providers define various ways a user can log in; here we use a custom credentials provider.
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Credentials expected from the client
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // 'authorize' method checks the user's credentials against the DB.
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          await connectToDB();
          const client = mongoose.connection.getClient();
          const db = client.db("BA-DINGDONG-DB"); 
          const usersCollection = db.collection("users");

          // Find a user document matching the provided username/password
          const user = await usersCollection.findOne({
            username: credentials.username,
            password: credentials.password, 
          });

          if (user) {
            // Return only the data we want to store in the session
            return {
              id: user.id,
              role: user.role,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
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
      // Add role and id to the session
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
