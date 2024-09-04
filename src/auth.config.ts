import Github from 'next-auth/providers/github';
import type { NextAuthConfig } from "next-auth";
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { loginSchema } from "schemas";
import { getUserByEmail } from "lib/data/user";
import { compare } from "bcrypt-ts";

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Github({
            clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                console.log("Authorize function called with credentials:", credentials);
                const validInputFields = loginSchema.safeParse(credentials);

                if (validInputFields.success) {
                    const { email, password } = validInputFields.data;

                    const user = await getUserByEmail(email);
                    console.log("User from database:", user);

                    if (!user || !user?.password) {
                        console.log("User not found or password not set");
                        return null;
                    }

                    const isPasswordMatch = await compare(password, user.password);

                    if (isPasswordMatch) {
                        console.log("Password match, returning user:", user);
                        return user;
                    } else {
                        console.log("Password does not match");
                    }
                } else {
                    console.log("Invalid input fields:", validInputFields.error);
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback - token before:", token);
            console.log("JWT callback - user:", user);

            if (user) {
                token.role = user.role;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.isOnboardedVendor = user.isOnboardedVendor;
                token.hasPaid = user.hasPaid;
                token.shopStatus = user.shop?.status;
            }

            console.log("JWT callback - token after:", token);
            return token;
        },
        async session({ session, token }) {
            console.log("Session callback - session before:", session);
            console.log("Session callback - token:", token);

            if (session.user) {
                session.user.id = token.sub as string;
                session.user.role = token.role as string;
                session.user.firstname = token.firstname as string;
                session.user.lastname = token.lastname as string;
                session.user.isOnboardedVendor = token.isOnboardedVendor as boolean;
                session.user.hasPaid = token.hasPaid as boolean;
                session.user.shopStatus = token.shopStatus as string | undefined;
            }

            console.log("Session callback - session after:", session);
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour in seconds
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;