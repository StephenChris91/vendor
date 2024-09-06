"use server"

import { db } from "../../prisma/prisma";
import { VerificationStatus } from '@prisma/client'
import { createTransporter, domain } from "@lib/emails/email";
import { EmailTemplateProps, generateEmailHTML } from "@component/verification-email";


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

    // Prepare email content
    const emailProps: EmailTemplateProps = {
      logoUrl: `${domain}/logo.png`,
      emailHeading: 'New Verification Documents Submitted',
      emailBody: `
        <p>New verification documents have been submitted for review. Please find the details below:</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Number of Documents:</strong> ${documents.length}</p>
        <p>Please review the attached documents and update the user's verification status accordingly.</p>
      `,
      callToAction: {
        url: `${domain}/admin/users/${userId}`,
        text: 'Review User Profile'
      },
      currentYear: new Date().getFullYear(),
      privacyPolicyUrl: `${domain}/privacy`,
      termsOfServiceUrl: `${domain}/terms`,
    };

    // Generate HTML content
    const htmlContent = generateEmailHTML(emailProps);

    // Create transporter
    const transporter = createTransporter();

    // Send email to admin using Nodemailer
    await transporter.sendMail({
      from: '"Vendorspot Notification" <admin@vendorspot.ng>',
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
      subject: "New Verification Documents Submitted",
      html: htmlContent,
      attachments: attachments,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting verification documents:", error);
    throw new Error("Failed to submit verification documents");
  }
}