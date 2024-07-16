// routes.ts

export const publicRoutes: string[] = [
    '/',
    '/auth/new-verification',
    '/auth/forgot-password',
    '/vendors',
    '/vendors/:id',
    '/shop',
    '/track',
    '/compare',
    '/support',
];

export const authRoutes: string[] = [
    '/auth/login',
    '/auth/signup',
    '/auth/new-password',
    '/auth/onboarding',
];

export const userRoutes: string[] = [
    '/auth/profile',
    '/profile',
    '/profile/edit',
    '/orders',
    '/orders/:id',
    '/address',
    '/address/create',
    '/support-tickets',
    '/support-tickets/:id',
    '/wish-list',
    '/cart',
    '/checkout',
    '/checkout-alternative',
];

export const adminRoutes: string[] = [
    '/dashboard',
];

export const vendorRoutes: string[] = [
    '/vendor/dashboard',
    '/vendor/products',
    '/vendor/products/:id',
    '/vendor/orders',
    '/vendor/orders/:id',
    '/vendor/account-settings',
];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/profile';
export const DEFAULT_ADMIN_REDIRECT = '/dashboard';
export const DEFAULT_VENDOR_REDIRECT = '/vendor/dashboard';