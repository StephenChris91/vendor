// actions/submitVerificationDocuments.ts

'use server'

import { createTransporter } from "@lib/emails/email";
import { Attachment } from "nodemailer/lib/mailer";

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
    console.log("Submitting documents for user:", userId);
    console.log("User email:", userEmail);
    console.log("Number of documents:", documents.length);

    const transporter = createTransporter();

    // Prepare email attachments
    const attachments: Attachment[] = documents.map((doc) => {
      // Split base64 header and content
      const base64Content = doc.content.split(",")[1]; // Removes the `data:...base64,` prefix
      return {
        filename: doc.name,
        content: base64Content, // The actual base64 content
        encoding: "base64",
        contentType: doc.type, // Use the MIME type of the file
      };
    });

    console.log("Prepared attachments:", attachments.map((a) => a.filename));

    // Send email with the attachments
    const mailResult = await transporter.sendMail({
      from: "admin@vendorspot.ng",
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
      subject: `Verification Documents for User ${userId}`,
      text: `User ${userId} (${userEmail}) has submitted verification documents. Please find them attached.`,
      attachments, // Attach the documents
    });

    console.log("Email sent:", mailResult);

    return { success: true, message: "Documents submitted successfully" };
  } catch (error) {
    console.error("Error submitting documents:", error);
    throw new Error(`Failed to submit documents: ${error.message}`);
  }
}
