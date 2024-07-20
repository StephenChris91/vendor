"use server"

import { db } from "prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitVerificationDocuments(
  userId: string,
  userEmail: string,
  documentUrl: string,
  documentType: string
) {
  try {
    // Update user's profile with the document URL
    await db.user.update({
      where: { id: userId },
      data: {
        verificationDocumentUrl: documentUrl,
        verificationStatus: "PENDING",
      },
    });

    // Send email to admin using Resend
    await resend.emails.send({
      from: "Your App <onboarding@yourdomain.com>", // Replace with your verified domain
      to: process.env.ADMIN_EMAIL!,
      subject: "New Verification Document Submitted",
      html: `
        <p>A new verification document has been submitted:</p>
        <p>User ID: ${userId}</p>
        <p>User Email: ${userEmail}</p>
        <p>Document Type: ${documentType}</p>
        <p>Document URL: <a href="${documentUrl}">${documentUrl}</a></p>
        <p>Please review and update the user's verification status.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting verification document:", error);
    throw new Error("Failed to submit verification document");
  }
}
