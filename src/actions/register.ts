'use server'

import * as z from 'zod';
import { hash } from 'bcrypt-ts'
import { signupSchema } from 'schemas';
import { getUserByEmail } from 'lib/data/user';
import { generateVerificationToken } from 'lib/data/tokens';
import { sendVerificationEmail } from '@lib/emails/mail';
import { db } from '../../prisma/prisma';

export const register = async (values: z.infer<typeof signupSchema>) => {

    console.log("Registration attempt with values:", values);

    const validInput = signupSchema.safeParse(values)

    if (!validInput.success) {
        console.log("Invalid input:", validInput.error);

        return { error: 'Invalid Credentials' }
    }

    const { email, password, confirmPassword, firstname, lastname, role } = validInput.data;

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: 'User already exists' }
        }

        const hashedPassword = await hash(password, 10)

        await db.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                role,
            }
        })

        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        console.log("Registration successful, sending verification email");
        return { success: 'Confirmation email sent' }
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'An error occurred during registration' }
    }
}