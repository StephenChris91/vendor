'use server'

import * as z from 'zod';
import { hash } from 'bcrypt-ts'
import { signupSchema } from '@/app/schemas';
import { getUserByEmail } from '@/lib/data/user';
import { db } from '@/prisma/prisma';
import { generateVerificationToken } from '@/lib/data/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof signupSchema>) => {
    const validInput = signupSchema.safeParse(values)

    if (!validInput.success) {
        return { error: 'Invalid Credentials'}
    }

    const {email, password, confirmPassword, firstname, lastname, role } = validInput.data;

    const existingUser = await getUserByEmail(email);
    
    const hashedPassword = await hash(password, 10)
    if(existingUser) {
        if(!password || password !== confirmPassword) {
            return { error: 'Passwords do not match'}
        }
        return {error: 'User already exists'}
    }

        try {
           await db.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                role,
            }
           })
        } catch (error) {
            console.log(error)

            throw error
        }

        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        return { success: 'Confirmation email sent'}
}