import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from "next-auth";
import authConfig from "auth.config";
import { db } from '../prisma/prisma';
import { getUserByEmail, getUserById } from 'lib/data/user';
import { userRole } from '@prisma/client';
import type { Adapter } from 'next-auth/adapters';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    adapter: PrismaAdapter(db) as Adapter,
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/app/auth/login',
        error: '/app/auth/error',
        verifyRequest: '/app/auth/verify-request',
        newUser: '/app/auth/new-user',
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date()
                }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account && account.provider !== 'credentials') return true;

            const existingUser = await getUserByEmail(user?.email ?? '');

            if (!existingUser || !existingUser.emailVerified) return false;

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.isOnboardedVendor = user.isOnboardedVendor;
            }

            return token;
        },
        async session({ token, session }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.role = token.role as userRole;
                session.user.emailVerified = token.emailVerified as Date;
                session.user.firstname = token.firstname as string;
                session.user.lastname = token.lastname as string;
                session.user.isOnboardedVendor = token.isOnboardedVendor as boolean;
            }

            console.log("Session in callback:", session);

            return session;
        }
    },
    ...authConfig,
});