// app/api/send-vendor-approval-email/route.ts

import { createTransporter } from '@lib/emails/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { vendorEmail, vendorName } = body;

    if (!vendorEmail || !vendorName) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.NEXT_PUBLIC_MAIL_FROM,
        to: vendorEmail,
        subject: 'Your Vendor Account Has Been Approved',
        html: `
      <h1>Congratulations, ${vendorName}!</h1>
      <p>Your vendor account has been approved. You can now start selling on our platform.</p>
      <p>Please log in to your account to set up your shop and add products.</p>
      <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/vendor/dashboard" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Go to Vendor Dashboard</a>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Team</p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }
}