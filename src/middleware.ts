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

const isOrdersRoute = (path) => {
    return path === '/orders' || /^\/orders\/[^\/]+$/.test(path);
};

export default auth((req) => {
    try {
        const { nextUrl } = req;
        const isLoggedIn = !!req.auth;

        const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
        const isPublicRoute = publicRoutes.some(route =>
            route.includes(':') || route.includes('*')
                ? nextUrl.pathname.startsWith(route.split(/[:*]/)[0])
                : nextUrl.pathname === route
        );

        const isAuthRoute = authRoutes.some(route =>
            route.includes(':') || route.includes('*')
                ? nextUrl.pathname.startsWith(route.split(/[:*]/)[0])
                : nextUrl.pathname === route
        );
        const isAdminRoute = adminRoutes.some(route =>
            route.includes('*')
                ? nextUrl.pathname.startsWith(route.split('*')[0])
                : nextUrl.pathname.startsWith(route)
        );
        const isVendorRoute = vendorRoutes.some(route =>
            route.includes('*')
                ? nextUrl.pathname.startsWith(route.split('*')[0])
                : nextUrl.pathname.startsWith(route)
        );

        const isApiDataRoute = nextUrl.pathname.startsWith('/api/');
        const isShopRoute = nextUrl.pathname.startsWith('/shops/');
        const isProductRoute = nextUrl.pathname.startsWith('/product');
        const isOnboardingRoute = nextUrl.pathname.startsWith('/onboarding');
        const isCheckoutRoute = nextUrl.pathname.startsWith('/checkout');

        // Always allow access to API routes, shop routes, and product routes
        if (isApiAuthRoute || isApiDataRoute || isShopRoute || isProductRoute) {
            return null;
        }

        // Handle non-logged in users
        if (!isLoggedIn) {
            // Allow access to public routes
            if (isPublicRoute) {
                return null;
            }
            // Redirect to login for protected routes
            if (isAuthRoute || isCheckoutRoute || isVendorRoute || isAdminRoute || isOrdersRoute(nextUrl.pathname)) {
                return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl));
            }
        }

        // Handle logged-in users
        if (isLoggedIn && req.auth) {
            const user = req.auth.user;

            // Check for session expiry
            const sessionExpiry = req.auth.expires;
            if (sessionExpiry && new Date() > new Date(sessionExpiry)) {
                return NextResponse.redirect(new URL('/login', nextUrl));
            }

            // Handle vendor-specific logic
            if (user.role === "Vendor") {
                if (isOnboardingRoute) return null;
                if (!user.isOnboardedVendor && !isPublicRoute && !isOnboardingRoute) {
                    return NextResponse.redirect(new URL('/onboarding', nextUrl));
                }
                if (user.isOnboardedVendor && !user.shop && !isPublicRoute && !isOnboardingRoute) {
                    return NextResponse.redirect(new URL('/onboarding', nextUrl));
                }
                if (user.isOnboardedVendor && user.shop && isAuthRoute) {
                    return NextResponse.redirect(new URL(DEFAULT_VENDOR_REDIRECT, nextUrl));
                }
                if (isVendorRoute) return null;
            }

            // Handle admin-specific logic
            if (user.role === "Admin") {
                if (isAuthRoute) {
                    return NextResponse.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
                }
                if (isAdminRoute) return null;
            }

            // Handle customer-specific logic
            if (user.role === "Customer") {
                if (isAuthRoute) {
                    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
                }
                if (isOrdersRoute(nextUrl.pathname)) return null;
            }

            // Prevent access to incorrect role routes
            if ((isAdminRoute && user.role !== "Admin") ||
                (isVendorRoute && user.role !== "Vendor")) {
                return NextResponse.redirect(new URL("/", nextUrl));
            }
        }

        // Allow access to all other routes
        return null;
    } catch (error) {
        console.error("Middleware error:", error);
        // In case of any error, allow the request to proceed
        return null;
    }
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};