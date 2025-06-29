// import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  callbacks: {
    async authorized({ request, auth }:unknown) {
      const url = request.nextUrl;
      const isLogined = auth?.user;
      const isOnDashboard = url.pathname.startsWith("/chat");
      if (isOnDashboard) {
        if (isLogined) return true;
        return false;
      } else if (isLogined) {
        return Response.redirect(new URL("/chat", url));
      }
      return true;
    },
  },
};
