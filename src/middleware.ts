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
    DEFAULT_ADMIN_REDIRECT
} from 'routes';

// Helper function to filter undefined values
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
    const isVerificationRoute = nextUrl.pathname === '/verification';

    if (isApiAuthRoute) {
        return null;
    }

    if (isVerificationRoute) {
        return null; // Allow access to verification route without redirection
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        let from = nextUrl.pathname;
        if (nextUrl.search) {
            from += nextUrl.search;
        }
        return NextResponse.redirect(new URL("/verification", nextUrl));
    }

    if (isAdminRoute && req.auth?.user?.role !== "Admin") {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};