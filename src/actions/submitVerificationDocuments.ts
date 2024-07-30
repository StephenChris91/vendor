"use server"

import { Resend } from "resend";
import { db } from "../../prisma/prisma";
import { VerificationStatus } from '@prisma/client'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_VERIFICATION_KEY);

export async function submitVerificationDocuments(
  userId: string,
  userEmail: string,
  documents: { name: string; content: string; type: string }[]
) {
  try {
    // Update user's profile to indicate documents have been submitted
    await db.user.update({
      where: { id: userId },
      data: {
        verificationStatus: VerificationStatus.Pending
      }
    });

    // Prepare attachments for the email
    const attachments = documents.map(doc => ({
      filename: doc.name,
      content: Buffer.from(doc.content, 'base64'),
    }));

    // Send email to admin using Resend
    await resend.emails.send({
      from: "Vendorspot Notification <admin@vendorspot.ng>",
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
      subject: "New Verification Documents Submitted",
      html: `
        <p>New verification documents have been submitted:</p>
        <p>User ID: ${userId}</p>
        <p>User Email: ${userEmail}</p>
        <p>Number of Documents: ${documents.length}</p>
        <p>Please review the attached documents and update the user's verification status.</p>
      `,
      attachments: attachments,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting verification documents:", error);
    throw new Error("Failed to submit verification documents");
  }
}