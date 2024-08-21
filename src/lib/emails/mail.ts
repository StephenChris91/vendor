import { Resend } from 'resend';
import VendorNotificationEmail from './vendorNotifications';
import OrderConfirmation from './orderConfirmation';

// Initialize the Resend instance
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_VERIFICATION_KEY);

// Determine the domain based on the environment
const domain = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_FRONTEND_PROD_URL
  : process.env.NEXT_PUBLIC_FRONTEND_DEV_URL;

// Function to send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verification?token=${token}`;
  await resend.emails.send({
    from: 'Vendorspot Notification <admin@vendorspot.ng>',
    to: email,
    subject: 'Verify your email address',
    html: `<p>Please click the link below to verify your email address: <a href="${confirmationLink}">${confirmationLink}</a></p>`
  });
};

// Function to send reset password email
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: 'admin@vendorspot.ng',
    to: email,
    subject: 'Reset Password',
    html: `<p>Please click : <a href="${resetLink}">here</a> below to verify your email address> </p>`
  });
};

export const sendOrderConfirmationEmail = async (order: any, customerEmail: string) => {
  await resend.emails.send({
    from: 'Vendorspot Orders <orders@vendorspot.ng>',
    to: customerEmail,
    subject: 'Order Confirmation',
    react: OrderConfirmation({ order }),
  });
};

export const sendVendorNotificationEmail = async (vendor: any, order: any, vendorOrderItems: any[]) => {
  await resend.emails.send({
    from: 'Vendorspot Orders <orders@vendorspot.ng>',
    to: vendor.email,
    subject: 'New Order Received',
    react: VendorNotificationEmail({
      vendorName: vendor.firstname,
      shopName: vendor.shop.shopName,
      orderId: order.id,
      orderDate: order.createdAt,
      orderItems: vendorOrderItems,
      subtotal: vendorOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      tax: order.tax * (vendorOrderItems.length / order.orderItems.length), // Approximate tax allocation
      shippingCost: order.shippingCost * (vendorOrderItems.length / order.orderItems.length), // Approximate shipping cost allocation
      total: vendorOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
        (order.tax + order.shippingCost) * (vendorOrderItems.length / order.orderItems.length),
    }),
  });
};
