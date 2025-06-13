// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    const signInUrl = new URL("/login", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat((?!api|_next/static|_next/image|favicon.ico).*)"],
};
