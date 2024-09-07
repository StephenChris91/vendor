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
    const isOnboardingRoute = nextUrl.pathname.startsWith('/onboarding');
    const isCheckoutRoute = nextUrl.pathname.startsWith('/checkout');
    const isVendorPath = nextUrl.pathname.startsWith('/vendor');

    // Always block non-logged-in users from accessing vendor routes
    if (!isLoggedIn && (isVendorRoute || isVendorPath)) {
        return Response.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl));
    }

    // Allow access to API routes, shop routes, and product routes
    if (isApiAuthRoute || isApiDataRoute || isShopRoute || isProductRoute) {
        return null;
    }

    // Handle non-logged in users
    if (!isLoggedIn) {
        // Allow access to public routes and auth routes
        if (isPublicRoute || isAuthRoute) {
            return null;
        }
        // Redirect to login for protected routes, including checkout
        return Response.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl));
    }

    // Handle logged-in users
    if (isLoggedIn) {
        const user = req.auth?.user;

        // Check for session expiry
        const sessionExpiry = req.auth.expires;
        if (sessionExpiry && new Date() > new Date(sessionExpiry)) {
            return Response.redirect(new URL('/login', nextUrl));
        }

        // Allow access to checkout for logged-in users
        if (isCheckoutRoute) {
            return null;
        }

        // Handle vendor-specific logic
        if (user?.role === "Vendor") {
            if (!user.isOnboardedVendor) {
                // If not onboarded, allow access to public routes and onboarding
                if (isPublicRoute || isOnboardingRoute) {
                    return null;
                }
                // Redirect to onboarding for vendor routes
                if (isVendorRoute || isVendorPath) {
                    return Response.redirect(new URL('/onboarding', nextUrl));
                }
            } else if (!user.shop) {
                // If onboarded but no shop, redirect to onboarding unless it's a public route
                if (!isPublicRoute && !isOnboardingRoute) {
                    return Response.redirect(new URL('/onboarding', nextUrl));
                }
            } else if (isAuthRoute) {
                // If fully set up, redirect away from auth routes
                return Response.redirect(new URL(DEFAULT_VENDOR_REDIRECT, nextUrl));
            }
        } else {
            // Non-vendor users cannot access vendor routes
            if (isVendorRoute || isVendorPath) {
                return Response.redirect(new URL("/", nextUrl));
            }
        }

        // Handle admin-specific logic
        if (user?.role === "Admin") {
            if (isAuthRoute) {
                return Response.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
            }
            if (isAdminRoute) {
                return null; // Allow access to admin routes
            }
        }

        // Handle customer-specific logic
        if (user?.role === "Customer") {
            if (isAuthRoute) {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
        }

        // Prevent non-admins from accessing admin routes
        if (isAdminRoute && user?.role !== "Admin") {
            return Response.redirect(new URL("/", nextUrl));
        }
    }

    // Allow access to all other routes
    return null;
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};