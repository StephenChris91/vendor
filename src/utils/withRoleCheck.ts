// utils/withRoleCheck.ts
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

type AllowedRoles = 'Admin' | 'Vendor' | 'Customer';

// Import the correct getServerSession function based on your Next.js version
let getServerSession: (req: any, res: any, options: any) => Promise<Session | null>;

try {
    // For Next.js 13 and newer
    getServerSession = require("next-auth/next").getServerSession;
} catch (error) {
    // For older versions of Next.js
    getServerSession = require("next-auth").getServerSession;
}

// Import authOptions dynamically to avoid import errors
async function getAuthOptions() {
    try {
        // Try to import from app directory (Next.js 13+)
        return (await import("../app/api/auth/[...nextauth]/route")).authOptions;
    } catch (error) {
        try {
            // Try to import from pages directory
            return (await import("../pages/api/auth/[...nextauth]")).authOptions;
        } catch (error) {
            console.error("Failed to import authOptions. Please ensure your NextAuth configuration file is set up correctly.");
            return null;
        }
    }
}

export function withRoleCheck(allowedRoles: AllowedRoles[], gssp?: GetServerSideProps) {
    return async (context: GetServerSidePropsContext) => {
        const authOptions = await getAuthOptions();

        if (!authOptions) {
            console.error("Auth options not found. Role check cannot be performed.");
            return {
                redirect: {
                    destination: '/error',
                    permanent: false,
                },
            };
        }

        const session = await getServerSession(context.req, context.res, authOptions);

        if (!session) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        if (!session.user?.role || !allowedRoles.includes(session.user.role as AllowedRoles)) {
            return {
                redirect: {
                    destination: '/unauthorized',
                    permanent: false,
                },
            };
        }

        if (gssp) {
            return await gssp(context);
        }

        return {
            props: {},
        };
    };
}