import { db } from '../../../prisma/prisma';

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        console.log('User fetched:', user);
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('User fetch failed');
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('User fetch by ID failed');
    }
};