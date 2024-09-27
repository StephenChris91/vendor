// actions/submitVerificationDocuments.ts

'use server'

import { createTransporter, domain } from '@lib/emails/email';
import { Attachment } from 'nodemailer/lib/mailer';

interface DocumentData {
  name: string;
  content: string;
  type: string;
}


export async function submitVerificationDocuments(
  userId: string,
  userEmail: string,
  documents: DocumentData[]
) {
  try {
    console.log('Submitting documents for user:', userId);
    console.log('User email:', userEmail);
    console.log('Number of documents:', documents.length);

    const transporter = createTransporter();

    // Prepare email attachments
    const attachments: Attachment[] = documents.map((doc) => ({
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
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
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

    return { success: true, message: 'Documents submitted successfully' };
  } catch (error) {
    console.error("Error submitting documents:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to submit documents: ${error.message}`);
    } else {
      throw new Error("Failed to submit documents: Unknown error");
    }
  }
}