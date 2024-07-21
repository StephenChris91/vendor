// actions/login.ts
"use server"

import { z } from 'zod';
import { loginSchema } from 'schemas';
import { sendVerificationEmail } from 'lib/mail';
import { getUserByEmail } from 'lib/data/user';
import { generateVerificationToken } from 'lib/data/tokens';
import { signIn } from 'auth';
import { revalidatePath } from 'next/cache';

export const login = async (values: z.infer<typeof loginSchema>) => {
    const validInput = loginSchema.safeParse(values)

    if (!validInput.success) {
        return { error: 'Invalid Credentials' }
    }

    const { email, password } = validInput.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'This user does not exist!' };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: 'Confirmation email sent' };
    }

    const vendorOnboard = existingUser.role === 'Vendor' && existingUser.isOnboardedVendor;
    const vendorNotOnboarded = existingUser.role === 'Vendor' && !existingUser.isOnboardedVendor;
    const isAdmin = existingUser.role === "Admin";

    try {
        await signIn('credentials', {
            email,
            password,
        });

        revalidatePath('/')

        let redirectTo = '/profile'; // Default redirect
        if (isAdmin) redirectTo = '/admin';
        else if (vendorOnboard) redirectTo = '/vendor/dashboard';
        else if (vendorNotOnboarded) redirectTo = '/onboarding';

        return { success: 'Logged in successfully', redirectTo };
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return { error: 'Invalid email or password' };
        }
        throw error;
    }
};