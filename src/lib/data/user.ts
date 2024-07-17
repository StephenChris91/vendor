import { db } from '../../../prisma/prisma';

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        console.log('User fetched:', user);
        return user; // Return null if user doesn't exist
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Database error while fetching user');
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