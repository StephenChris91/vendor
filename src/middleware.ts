import NextAuth from "next-auth";
import authConfig from "auth.config";
import {
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_ADMIN_REDIRECT,
    DEFAULT_VENDOR_REDIRECT,
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    adminRoutes,
    vendorRoutes
} from "routes";
import { NextResponse } from "next/server";

const { auth: nextAuthMiddleware } = NextAuth(authConfig);

export default async function middleware(req) {
    const { nextUrl } = req;

    // Run the next-auth middleware
    const authResult = await nextAuthMiddleware(req);

    // If next-auth middleware returns a response, return it
    if (authResult) return authResult;

    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));
    const isVendorRoute = vendorRoutes.some(route => nextUrl.pathname.startsWith(route));

    const isApiDataRoute = nextUrl.pathname.startsWith('/api/');
    const isShopRoute = nextUrl.pathname.startsWith('/shops/');

    if (isLoggedIn) {
        const session = req.auth;
        const lastActivity = session.lastActivity as number | undefined;
        const currentTime = Date.now();
        const idleTime = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (lastActivity && currentTime - lastActivity > idleTime) {
            // User has been idle for more than 5 minutes
            return NextResponse.redirect(new URL('/api/auth/signout', nextUrl));
        }
    }

    // Then in your middleware logic:
    if (isApiAuthRoute || isApiDataRoute || isShopRoute) {
        return null;
    }

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            // Special case for onboarding and confirmation
            if ((nextUrl.pathname === '/onboarding' || nextUrl.pathname === '/onboarding/confirmation')
                && req.auth?.user?.role === "Vendor") {
                return null; // Allow access to onboarding and confirmation for vendors
            }

            // Redirect based on user role
            if (req.auth?.user?.role === "Admin") {
                return NextResponse.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
            } else if (req.auth?.user?.role === "Vendor") {
                if (!req.auth?.user?.isOnboardedVendor && nextUrl.pathname !== '/onboarding/confirmation') {
                    return NextResponse.redirect(new URL('/onboarding', nextUrl));
                }
                return NextResponse.redirect(new URL(DEFAULT_VENDOR_REDIRECT, nextUrl));
            } else {
                return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return NextResponse.redirect(new URL(
            `/login?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    if (isLoggedIn) {
        if (isAdminRoute && req.auth?.user?.role !== "Admin") {
            return NextResponse.redirect(new URL("/", nextUrl));
        }

        if (isVendorRoute && req.auth?.user?.role !== "Vendor") {
            return NextResponse.redirect(new URL("/", nextUrl));
        }

        // Vendor onboarding check
        if (req.auth?.user?.role === "Vendor" && !req.auth?.user?.isOnboardedVendor
            && !isPublicRoute && !req.auth?.user?.hasPaid && nextUrl.pathname !== '/onboarding' && nextUrl.pathname !== '/onboarding/confirmation') {
            return NextResponse.redirect(new URL('/onboarding', nextUrl));
        }
    }

    return null;
}

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}