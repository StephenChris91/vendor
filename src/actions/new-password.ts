'use server'
import { getPasswordResetTokenByToken } from '@/lib/data/verification-token';
import { NewPasswordSchema } from '../app/schemas/index';

import { z } from "zod"
import { getUserByEmail } from '@/lib/data/user';
import { db } from '@/prisma/prisma';
import { compare, compareSync, hash } from 'bcrypt-ts';

export const NewPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token: string | null) => {

    if(!token) { 
        return { error: 'Missing token'}
    }

    const validateFields = NewPasswordSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: 'Invalid Fields'}
    }

    const { password } = validateFields.data

    const existingToken = await getPasswordResetTokenByToken(token);


    if(!existingToken) {
        return {error: 'This token does not exist!'}
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if(hasExpired) {
        return { error: 'Token has expired'}
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser) {
        return { error: 'Email does not exist'}

    }

    const hashedPassword = await hash(password, 10)

    const isFormerPassword = hashedPassword === existingUser.password

    if(isFormerPassword) {
        return { error: 'This password has already been used'}
    }

    
    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete(
        {
            where: {
                id: existingToken.id
            }
        }
    )

    return { success: 'Password reset successfully' }

}