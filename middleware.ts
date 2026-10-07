import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const role = session?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isCustomerRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/quotes") ||
    nextUrl.pathname.startsWith("/orders") ||
    nextUrl.pathname.startsWith("/invoices") ||
    nextUrl.pathname.startsWith("/profile");
  const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout");
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  if (isAuthRoute && isLoggedIn) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", nextUrl));
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isCustomerRoute || isCheckoutRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|og-default.jpg).*)",
  ],
};
