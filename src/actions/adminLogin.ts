// actions/adminLogin.ts
"use server"

import { z } from 'zod';
import { getUserByEmail } from 'lib/data/user';
import { signIn } from 'auth';
import { revalidatePath } from 'next/cache';
import { adminLoginSchema } from 'schemas';

export const adminLogin = async (values: z.infer<typeof adminLoginSchema>) => {
    const validInput = adminLoginSchema.safeParse(values)

    if (!validInput.success) {
        return { error: 'Invalid Credentials' }
    }

    const { email, password } = validInput.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password || existingUser.role !== 'Admin') {
        return { error: 'Invalid admin credentials' };
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/dashboard'
        });

        revalidatePath('/')

        return { success: 'Logged in successfully' };
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return { error: 'Invalid email or password' };
        }
        throw error;
    }
};