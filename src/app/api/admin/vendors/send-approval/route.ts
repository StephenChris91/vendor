import { sendVendorApprovalEmail } from '@lib/emails/vendorAprrovalNotifications';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { vendorEmail, vendorName } = await req.json(); // Parse the request body

        if (!vendorEmail || !vendorName) {
            return NextResponse.json({ message: 'Missing vendor email or name' }, { status: 400 });
        }

        await sendVendorApprovalEmail(vendorEmail, vendorName);

        return NextResponse.json({ message: 'Approval email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending approval email:', error);
        return NextResponse.json({ message: 'Failed to send approval email' }, { status: 500 });
    }
}
