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

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

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
            // Special case for onboarding
            if (nextUrl.pathname === '/onboarding' && req.auth?.user?.role === "Vendor" && !req.auth?.user?.isOnboardedVendor) {
                return null; // Allow access to onboarding for non-onboarded vendors
            }

            // Redirect based on user role
            if (req.auth?.user?.role === "Admin") {
                return Response.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
            } else if (req.auth?.user?.role === "Vendor") {
                if (!req.auth?.user?.isOnboardedVendor) {
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
        if (isAdminRoute && req.auth?.user?.role !== "Admin") {
            return Response.redirect(new URL("/", nextUrl));
        }

        if (isVendorRoute && req.auth?.user?.role !== "Vendor") {
            return Response.redirect(new URL("/", nextUrl));
        }

        // Vendor onboarding check
        if (req.auth?.user?.role === "Vendor" && !req.auth?.user?.isOnboardedVendor && nextUrl.pathname !== '/onboarding') {
            return Response.redirect(new URL('/onboarding', nextUrl));
        }
    }

    return null;
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}