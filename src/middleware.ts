// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const role = token.role?.toLowerCase();

    // Simple role check first
    switch (role) {
      case "admin":
        if (!path.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        break;
      case "lecturer":
        if (!path.startsWith("/lecturer")) {
          return NextResponse.redirect(new URL("/lecturer", req.url));
        }
        break;
      case "student":
        if (!path.startsWith("/student")) {
          return NextResponse.redirect(new URL("/student", req.url));
        }
        break;
      default:
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/lecturer/:path*", "/student/:path*"],
};
