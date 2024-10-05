// app/api/submit-verification-documents/route.ts

import { createTransporter } from '@lib/emails/email';
import { NextRequest, NextResponse } from 'next/server';
import { Attachment } from 'nodemailer/lib/mailer';

interface DocumentData {
    name: string;
    content: string;
    type: string;
}

export async function POST(request: NextRequest) {
    try {
        const { userId, userEmail, documents } = await request.json();

        // console.log('Submitting documents for user:', userId);
        // console.log('User email:', userEmail);
        // console.log('Number of documents:', documents.length);
        // console.log('Environment:', process.env.NODE_ENV);

        const transporter = createTransporter();

        // Prepare email attachments
        const attachments: Attachment[] = documents.map((doc: DocumentData) => ({
            filename: doc.name,
            content: doc.content.split(',')[1],
            encoding: 'base64',
        }));

        console.log('Prepared attachments:', attachments.map(a => a.filename));

        // Test SMTP connection
        try {
            await transporter.verify();
            console.log('SMTP connection successful');
        } catch (verifyError) {
            console.error('SMTP connection failed:', verifyError);
            console.error('SMTP settings:', {
                host: process.env.NEXT_PUBLIC_MAIL_HOST,
                port: process.env.NEXT_PUBLIC_MAIL_PORT,
                user: process.env.NEXT_PUBLIC_MAIL_USERNAME,
                // Don't log the actual password
            });
            return NextResponse.json(
                { message: `SMTP connection failed: ${verifyError.message}` },
                { status: 500 }
            );
        }

        // Send email
        const mailResult = await transporter.sendMail({
            from: "admin@vendorspot.ng",
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
            subject: `Verification Documents for User ${userId}`,
            text: `User ${userId} (${userEmail}) has submitted verification documents. Please find them attached.`,
            attachments,
        });

        console.log('Email sent:', mailResult);

        return NextResponse.json({ message: 'Documents submitted successfully' });
    } catch (error) {
        console.error("Error submitting documents:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: `Failed to submit documents: ${error.message}` },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { message: "Failed to submit documents: Unknown error" },
                { status: 500 }
            );
        }
    }
}