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
                const validInputFields = loginSchema.safeParse(credentials);

                if (validInputFields.success) {
                    const { email, password } = validInputFields.data;

                    const user = await getUserByEmail(email);
                    console.log(user);

                    if (!user || !user?.password) return null;

                    const isPasswordMatch = await compare(password, user?.password);

                    if (isPasswordMatch) return user;

                    // return user;

                }


                return null;
            },
        }),
    ],

} satisfies NextAuthConfig;