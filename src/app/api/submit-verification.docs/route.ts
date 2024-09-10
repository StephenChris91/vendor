// app/api/submit-verification-documents/route.ts

import { createTransporter } from '@lib/emails/email';
import { NextRequest, NextResponse } from 'next/server';
import { Attachment } from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
    try {
        const { userId, userEmail, documents } = await request.json();

        const transporter = createTransporter();

        // Prepare email attachments
        const attachments: Attachment[] = documents.map((doc: any) => ({
            filename: doc.name,
            content: doc.content.split(',')[1], // Remove the data:application/pdf;base64, part
            encoding: 'base64',
        }));

        // Send email
        await transporter.sendMail({
            from: process.env.NEXT_PUBLIC_MAIL_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: `Verification Documents for User ${userId}`,
            text: `User ${userId} (${userEmail}) has submitted verification documents. Please find them attached.`,
            attachments,
        });

        // Here you would typically also save the documents to your database or file storage

        return NextResponse.json({ message: 'Documents submitted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error submitting documents:', error);
        return NextResponse.json({ message: 'Failed to submit documents' }, { status: 500 });
    }
}