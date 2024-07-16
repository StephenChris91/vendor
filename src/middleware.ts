// src/middleware.ts

import { NextResponse } from 'next/server';
import { auth } from 'auth';  // Assuming you have an auth.ts file in the lib directory
import {
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
    authRoutes,
    adminRoutes,
    vendorRoutes,
    apiAuthPrefix,
} from 'routes';

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role || 'USER';

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));
    const isVendorRoute = vendorRoutes.some(route => nextUrl.pathname.startsWith(route));

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/app/login', nextUrl));
    }

    if (isLoggedIn) {
        if (isAdminRoute && userRole !== "Admin") {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        if (isVendorRoute && userRole !== "Vendor" && userRole !== "Admin") {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
    }

    return null;
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};