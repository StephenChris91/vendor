/**
 * @description: Public routes
 * An array of routes accessible to all users who visit the site.
 * @type {string[]}
 */
export const publicRoutes: (string | undefined)[] = ['/', '/dashboard', '/admin/adminLogin', '/address', '/address/:id', '/orders', '/orders/:id', '/payment-methods', '/payment-method/:id', '/wish-list', '/payment', '/cart', '/vendors', '/vendors/:id', '/shop', '/shops', '/shops/:id', '/shops/*', '/product', '/product/*', '/product/id', '/product/:id', '/product/search', '/product/search/:id', '/product/search/*', '/shops/:slug', '/track', '/compare', '/support', '/verification'];

/**
 * @description: Authenticated routes
 * An array of routes accessible to only authenticated users who visit the site.
 * @type {string[]}
 */
export const authRoutes: (string | undefined)[] = ['/login', '/signup', '/new-password', '/onboarding', '/onboarding/confirmation', '/checkout', '/vendor', '/vendor/*', '/vendor/dashboard', '/orders', '/orders/*', '/orders/:id'];

/**
 * @description: Authenticated routes
 * An array of routes accessible to only users with admin roles. This routes will redirect to the admin dashboard
 * @type {string[]}
 */
export const adminRoutes: (string | undefined)[] = ['/admin', '/admin/dashboard', "/admin/vendors", "/admin/products", "/admin/orders", "/admin/customers", "/admin/settings", "/admin/*"];


/**
 * @description: Authenticated routes
 * An array of routes accessible to only users with vendor roles. This routes will redirect to the vendor dashboard
 * @type {string[]}
 */
export const vendorRoutes = ['/vendor', '/vendor/account-settings', '/vendor/dashboard', '/vendor/products', '/vendor/products/:slug', '/vendor/products/create', '/vendor/*', '/vendor/orders', '/vendor/orders/:id'];

/**
 * @description: A prefix for api auth routes
 * Routes with this prefix are used for api authentication processes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * @description: A default redirect path for authenticated users
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/';

/**
 * @description: A default redirect path for admin users
 * @type {string}
 */
export const DEFAULT_ADMIN_REDIRECT = '/admin/dashboard';

/**
 * @description: A default redirect path for vendor users
 * @type {string}
 */
export const DEFAULT_VENDOR_REDIRECT = '/vendor/dashboard';