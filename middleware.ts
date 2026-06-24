import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const pathname = req.nextUrl.pathname;

  let session = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      session = payload;
    } catch {
      session = null;
    }
  }

  // NOT LOGGED IN
  if (
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/member")) &&
    !session
  ) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  if (session) {
    // LOG IN PAGE REDIRECT
    if (pathname === "/login") {
      if (session.role === "admin") {
        return NextResponse.redirect(
          new URL("/admin", req.url)
        );
      }

      if (session.role === "member") {
        return NextResponse.redirect(
          new URL(`/member/${session.username}`, req.url)
        );
      }
    }
  
    // ADMIN PAGE PROTECTION
    if (
      pathname.startsWith("/admin") &&
      session.role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL(`/member/${session.username}`, req.url)
      );
    }

    // MEMBER PAGE PROTECTION
    if (pathname.startsWith("/member")) {
      if (session.role !== "member") {
        return NextResponse.redirect(
          new URL("/admin", req.url)
        );
      }

      if (pathname === "/member") {
        return NextResponse.redirect(
          new URL(`/member/${session.username}`, req.url)
        );
      }

      // MEMBER PROFILE PROTECTION
      const match = pathname.match(/^\/member\/([^/]+)/);

      if (match) {
        const username = match[1];

        if (username !== session.username) {
          return NextResponse.redirect(
            new URL(`/member/${session.username}`, req.url)
          );
        }
      }
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*","/member/:path*","/login",],
};