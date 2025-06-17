/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
import { authConfig } from "./config.auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        console.log("user", user);

        try {
          if (res.ok && user.data) {
            const newuser = {
              ...user.data,
              accessToken: user.data.accessToken,
            };
            return newuser;
          } else {
            throw new Error("Invalid Login Credentials");
          }
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          throw new Error("Invalid response from server");
        }
      },
    }),
    // Google OAuth
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

    //   async profile(profile) {
    //     // Check if profile.sub exists
    //     if (!profile.sub) {
    //       throw new Error(
    //         "Profile id is missing in Google OAuth profile response"
    //       );
    //     }
    //     const newUser = {
    //       name: profile.name,
    //       email: profile.email,
    //       avatar: profile.picture,
    //       provider_id: profile.sub,
    //     };

    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/auth/get-user-by-email`,
    //       {
    //         method: "POST",
    //         body: JSON.stringify(newUser),
    //         headers: { "Content-Type": "application/json" },
    //       }
    //     );
    //     const user = await res.json();
    //     return user.data;
    //   },
    // }),
    // Facebook({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,

    //   async profile(profile) {
    //     const newUser = {
    //       name: profile.name,
    //       email: profile.email,
    //     };
    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/auth/get-user-by-email`,
    //       {
    //         method: "POST",
    //         body: JSON.stringify(newUser),
    //         headers: { "Content-Type": "application/json" },
    //       }
    //     );
    //     const user = await res.json();
    //     return user.data;
    //   },
    // }),
  ],
  pages: {
    signIn: "/login",
  },

  // pages: {
  //   signIn: "/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error",
  //   verifyRequest: "/auth/verify-request",
  //   newUser: "/auth/new-user",
  // },

  secret: process.env.NEXTAUTH_SECRET, // environment variable should be server and client same
  session: { strategy: "jwt", maxAge: 1 * 24 * 60 * 60 }, // 1 day
  callbacks: {
    async session({ session, token }): Promise<any> {
      return {
        ...session,
        user: token.user,
        token: { exp: token.exp, iat: token.iat, jti: token.jti },
      };
    },

    async jwt({ token, user }) {
      if (typeof user !== "undefined") {
        return {
          ...token,
          user,
        };
      }
      return token;
    },
  },
});
