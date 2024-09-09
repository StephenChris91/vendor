// utils/vendorNotifications.ts

import { createTransporter, domain } from "./email";


export async function sendVendorApprovalEmail(vendorEmail: string, vendorName: string) {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.NEXT_PUBLIC_MAIL_FROM,
        to: vendorEmail,
        subject: 'Your Vendor Account Has Been Approved',
        html: `
            <h1>Congratulations, ${vendorName}!</h1>
            <p>Your vendor account has been approved. You can now start selling on our platform.</p>
            <p>Please log in to your account to set up your shop and add products.</p>
            <a href="${domain}/vendor/dashboard" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Go to Vendor Dashboard</a>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent successfully');
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw new Error('Failed to send approval email');
    }
}