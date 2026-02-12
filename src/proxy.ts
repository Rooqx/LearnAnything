//Named this proxy.ts instead of middleware.ts because new nextjs version deprecated middleware.ts  so un name middleware.ts as proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./server/utils/session";

//  Define protected and public routes
const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  //  Check if the current route is protected
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isPublicRoute = publicRoutes.includes(path);

  //  Decrypt the session from the cookie
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie); // Decrypt the session from the server folder in the src folder

  //  Redirect Logic
  // in case:  User is NOT logged in and tries to access a protected route
  if (isProtectedRoute && !session?.accessToken) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // in Case : User IS logged in and tries to access login/register (it optional UX improvement sha)
  if (isPublicRoute && session?.accessToken && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

//  Config to prevent middleware from running on static files (images, fonts)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
