// actions/login.ts
"use server"

import { z } from 'zod';
import { loginSchema } from 'schemas';
import { sendVerificationEmail } from '@lib/emails/mail';
import { getUserByEmail } from 'lib/data/user';
import { generateVerificationToken } from 'lib/data/tokens';
import { compare } from 'bcrypt-ts';

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

    const passwordMatch = await compare(password, existingUser.password);

    if (!passwordMatch) {
        return { error: 'Invalid email or password' };
    }

    const vendorOnboard = existingUser.role === 'Vendor' && existingUser.isOnboardedVendor;
    const vendorNotOnboarded = existingUser.role === 'Vendor' && !existingUser.isOnboardedVendor;
    const isAdmin = existingUser.role === "Admin";

    let redirectTo = ''; // Default redirect
    if (isAdmin) redirectTo = '/admin';
    else if (vendorOnboard) redirectTo = '/vendor/dashboard';
    else if (vendorNotOnboarded) redirectTo = '/onboarding';

    return {
        success: 'Logged in successfully',
        redirectTo,
        user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            // Add any other user properties you need
        }
    };
};