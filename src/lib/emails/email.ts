import nodemailer from 'nodemailer';

export function createTransporter() {
    // Check if the environment is production
    if (process.env.NODE_ENV === 'production') {
        return nodemailer.createTransport({
            host: process.env.NEXT_PUBLIC_MAIL_HOST!,
            port: parseInt(process.env.NEXT_PUBLIC_MAIL_PORT! || '587'),
            secure: true,
            auth: {
                user: process.env.NEXT_PUBLIC_MAIL_USERNAME!,
                pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD!,
            },
        });
    } else {
        // Use Mailtrap credentials for development
        return nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "ad2a07d99e869c", // Mailtrap dev user
                pass: "e7fc44b59df8dd", // Mailtrap dev pass
            },
        });
    }
}

// Determine the domain based on the environment
export const domain = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_FRONTEND_PROD_URL
    : process.env.NEXT_PUBLIC_FRONTEND_DEV_URL;
