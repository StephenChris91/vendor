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

    await signIn('credentials', {
        email,
        password,
        redirectTo: vendorOnboard ? '/dashboard' : vendorNotOnboarded ? '/auth/onboarding' : '/profile'
    });

    revalidatePath('/')

    return { success: 'Logged in successfully' };
};
