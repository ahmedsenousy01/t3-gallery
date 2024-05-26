import { auth } from "~/server/auth";

import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  DEFAULT_REDIRECT_ROUTE,
} from "./server/auth-config/routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return undefined;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_ROUTE, nextUrl));
    }
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(
      new URL(
        `/api/auth/signin?callbackUrl=${nextUrl.pathname ?? DEFAULT_REDIRECT_ROUTE}`,
        nextUrl
      )
    );
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
