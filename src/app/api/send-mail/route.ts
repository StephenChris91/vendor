import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import VendorNotificationEmail from '@lib/emails/vendorNotifications';
import OrderConfirmation from '@lib/emails/orderConfirmation';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
    const { type, data } = await req.json();

    try {
        let sent;
        if (type === 'vendor-notification') {
            sent = await resend.emails.send({
                from: 'Vendorspot Team <admin@vendorspot.ng>',
                to: data.vendor.email,
                subject: `New Order Received - Order #${data.shopOrder.id}`,
                react: VendorNotificationEmail(data)
            });
        } else if (type === 'order-confirmation') {
            sent = await resend.emails.send({
                from: 'Vendorspot Notification <admin@vendorspot.ng>',
                to: data.userEmail,
                subject: `Order Confirmation - Order #${data.order.id}`,
                react: OrderConfirmation(data)
            });
        }

        return NextResponse.json({ success: true, id: sent?.data?.id });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}