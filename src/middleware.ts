import NextAuth from 'next-auth';
import authConfig from 'auth.config';
import { pathToRegexp } from 'path-to-regexp';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

import {
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    adminRoutes,
    vendorRoutes
} from 'routes';

const filterRoutes = (routes: (string | undefined)[]): string[] => {
    return routes.filter((route): route is string => typeof route === 'string');
};

const matchRoute = (path: string, routes: string[]): boolean => {
    return routes.some(route => {
        const regex = pathToRegexp(route);
        return regex.test(path);
    });
};

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = matchRoute(nextUrl.pathname, filterRoutes(publicRoutes));
    const isAuthRoute = matchRoute(nextUrl.pathname, filterRoutes(authRoutes));
    const isAdminRoute = matchRoute(nextUrl.pathname, filterRoutes(adminRoutes));
    const isVendorRoute = matchRoute(nextUrl.pathname, filterRoutes(vendorRoutes));

    // Allow API routes to pass through
    if (isApiAuthRoute) {
        return null;
    }

    // Handle auth routes
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    // // Handle protected routes
    // if (!isLoggedIn && !isPublicRoute) {
    //     let from = nextUrl.pathname;
    //     if (nextUrl.search) {
    //         from += nextUrl.search;
    //     }
    //     return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, nextUrl));
    // }

    // For logged-in users, we'll handle specific role-based redirects in the component level
    // This allows the application to load and then make decisions based on the user's role

    return null;
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};