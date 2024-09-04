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
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));
    const isVendorRoute = vendorRoutes.some(route => nextUrl.pathname.startsWith(route));

    const isApiDataRoute = nextUrl.pathname.startsWith('/api/');
    const isShopRoute = nextUrl.pathname.startsWith('/shops/');

    if (isApiAuthRoute || isApiDataRoute || isShopRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            if ((nextUrl.pathname === '/onboarding' || nextUrl.pathname === '/onboarding/confirmation')
                && req.auth?.user?.role === "Vendor") {
                return null;
            }

            if (req.auth?.user?.role === "Admin") {
                return Response.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
            } else if (req.auth?.user?.role === "Vendor") {
                if (!req.auth?.user?.isOnboardedVendor) {
                    return Response.redirect(new URL('/onboarding', nextUrl));
                }
                if (!req.auth?.user?.shop) {
                    return Response.redirect(new URL('/onboarding', nextUrl));
                }
                return Response.redirect(new URL(DEFAULT_VENDOR_REDIRECT, nextUrl));
            } else {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
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

        return Response.redirect(new URL(
            `/login?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    if (isLoggedIn) {
        // Check if the session has expired
        const sessionExpiry = req.auth.expires;
        if (sessionExpiry && new Date() > new Date(sessionExpiry)) {
            // Session has expired, redirect to login
            return Response.redirect(new URL('/login', nextUrl));
        }

        if (isAdminRoute && req.auth?.user?.role !== "Admin") {
            return Response.redirect(new URL("/", nextUrl));
        }

        if (isVendorRoute && req.auth?.user?.role !== "Vendor") {
            return Response.redirect(new URL("/", nextUrl));
        }

        if (req.auth?.user?.role === "Vendor") {
            if (!req.auth?.user?.isOnboardedVendor) {
                return Response.redirect(new URL('/onboarding', nextUrl));
            }
            if (!req.auth?.user?.shop && !publicRoutes.includes(nextUrl.pathname)) {
                return Response.redirect(new URL('/onboarding', nextUrl));
            }
        }
    }

    return null;
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};