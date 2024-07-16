'use server'

import * as z from 'zod';

import { ResetSchema } from '@/app/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/data/user';
import { generatePasswordResetToken, generateVerificationToken } from '@/lib/data/tokens';
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/mail';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validInput = ResetSchema.safeParse(values)

    if (!validInput.success) {
        return { error: 'Invalid Credentials'}
    }

    const { email } = validInput.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email) {
        return {error: 'Email does not exist!'}
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendResetPasswordEmail(passwordResetToken.email, passwordResetToken.token)


    console.log(email)

    return {success: 'Confirmation email sent'}

}