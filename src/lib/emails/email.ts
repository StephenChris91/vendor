// utils/emailUtils.ts

import nodemailer from 'nodemailer';

export function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.NEXT_PUBLIC_MAIL_HOST!,
        port: parseInt(process.env.NEXT_PUBLIC_MAIL_PORT! || '587'),
        secure: process.env.NEXT_PUBLIC_MAIL_SECURE! === 'true',
        auth: {
            user: process.env.NEXT_PUBLIC_MAIL_USER!,
            pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD!,
        },
    });
}

// Determine the domain based on the environment
export const domain = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_FRONTEND_PROD_URL
    : process.env.NEXT_PUBLIC_FRONTEND_DEV_URL;