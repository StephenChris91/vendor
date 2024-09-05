import { NextResponse } from 'next/server';
import { auth } from './auth';
import {
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_ADMIN_REDIRECT,
    DEFAULT_VENDOR_REDIRECT,
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    adminRoutes,
    vendorRoutes
} from "./routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some(route => nextUrl.pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => nextUrl.pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));
    const isVendorRoute = vendorRoutes.some(route => nextUrl.pathname.startsWith(route));

    const isApiDataRoute = nextUrl.pathname.startsWith('/api/');
    const isShopRoute = nextUrl.pathname.startsWith('/shops/');
    const isProductRoute = nextUrl.pathname.startsWith('/product');

    // Allow access to API routes, shop routes, and product routes
    if (isApiAuthRoute || isApiDataRoute || isShopRoute || isProductRoute) {
        return null;
    }

    // Protect checkout route
    if (nextUrl.pathname.startsWith('/checkout')) {
        if (!isLoggedIn) {
            return Response.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl));
        }
        return null;
    }

    // Handle authentication routes
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    // Handle non-public routes for non-logged in users
    if (!isLoggedIn && !isPublicRoute) {
        const callbackUrl = nextUrl.pathname + nextUrl.search;
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    }

    // Handle logged-in user access
    if (isLoggedIn) {
        // Check if the session has expired
        const sessionExpiry = req.auth.expires;
        if (sessionExpiry && new Date() > new Date(sessionExpiry)) {
            return Response.redirect(new URL('/login', nextUrl));
        }

        // Handle admin and vendor routes
        if (isAdminRoute && req.auth?.user?.role !== "Admin") {
            return Response.redirect(new URL("/", nextUrl));
        }

        if (isVendorRoute && req.auth?.user?.role !== "Vendor") {
            return Response.redirect(new URL("/", nextUrl));
        }

        // Handle vendor-specific redirects
        if (req.auth?.user?.role === "Vendor") {
            if (!req.auth?.user?.isOnboardedVendor) {
                return Response.redirect(new URL('/onboarding', nextUrl));
            }
            if (!req.auth?.user?.shop && !isPublicRoute) {
                return Response.redirect(new URL('/onboarding', nextUrl));
            }
        }
    }

    return null;
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};