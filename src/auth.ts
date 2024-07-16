import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from "next-auth";
import authConfig from "auth.config";
import { db } from '../prisma/prisma';
import { getUserById } from 'lib/data/user';
import { userRole } from 'app/next-auth';
// import { userRole } from "@prisma/client"


export const {

    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
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
            //allow oauth access without email verification
            if (account && account.provider !== 'credentials') return true;

            const existingUser = await getUserById(user?.id ?? '');

            if (!existingUser || !existingUser.emailVerified) return false;

            //TODO add 2fa check

            return true;
        },
        async session({ token, session }) {
            // console.log({sessionToken: token})
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as userRole;
            }

            if (token.emailVerified && session.user) {
                session.user.emailVerified = new Date(token.emailVerified as string)
            }

            if (token.firstname && session.user) {
                session.user.firstname = token.firstname as string;
            }

            if (token.lastname && session.user) {
                session.user.lastname = token.lastname as string;;
            }

            if (token.isOnboardedVendor && session.user) {
                session.user.isOnboardedVendor = token.isOnboardedVendor as boolean;
            }


            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub)

            if (!existingUser) return token;

            token.role = existingUser.role
            token.emailVerified = existingUser.emailVerified
            token.firstname = existingUser.firstname
            token.lastname = existingUser.lastname
            token.isOnboardedVendor = existingUser.isOnboardedVendor
            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
})