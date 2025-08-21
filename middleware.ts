import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest, event: any) {
  // Skip middleware for webhook route
  if (req.nextUrl.pathname === "/api/webhooks/clerk") {
    return;
  }

  // Run Clerk middleware properly by passing req and event
  return clerkMiddleware(req, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)", "/api/:path*", "/trpc/:path*"],
};
