// import { Resend } from 'resend';
// import VendorNotificationEmail from './vendorNotifications';
// import OrderConfirmation from './orderConfirmation';

// // Initialize the Resend instance
// const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_VERIFICATION_KEY);

// // Determine the domain based on the environment
// const domain = process.env.NODE_ENV === 'production'
//   ? process.env.NEXT_PUBLIC_FRONTEND_PROD_URL
//   : process.env.NEXT_PUBLIC_FRONTEND_DEV_URL;

// // Function to send verification email
// export const sendVerificationEmail = async (email: string, token: string) => {
//   const confirmationLink = `${domain}/verification?token=${token}`;
//   await resend.emails.send({
//     from: 'Vendorspot Notification <admin@vendorspot.ng>',
//     to: email,
//     subject: 'Verify your email address',
//     html: `<p>Please click the link below to verify your email address: <a href="${confirmationLink}">${confirmationLink}</a></p>`
//   });
// };

// // Function to send reset password email
// export const sendResetPasswordEmail = async (email: string, token: string) => {
//   const resetLink = `${domain}/new-password?token=${token}`;

//   await resend.emails.send({
//     from: 'admin@vendorspot.ng',
//     to: email,
//     subject: 'Reset Password',
//     html: `<p>Please click : <a href="${resetLink}">here</a> below to verify your email address> </p>`
//   });
// };

// export const sendOrderConfirmationEmail = async (email: string,
//   orderDetails: {
//     orderId: string;
//     items: any[];
//     subtotal: number;
//     tax: number;
//     shippingCost: number;
//     totalAmount: number;
//     shippingAddress: any;
//   }) => {
//   await resend.emails.send({
//     from: 'Vendorspot Orders <orders@vendorspot.ng>',
//     to: email,
//     subject: 'Order Confirmation',
//     react: OrderConfirmation({
//       order: {
//         id: orderDetails.orderId,
//         createdAt: new Date(),
//         orderItems: orderDetails.items.map(item => ({
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price
//         })),
//         subtotal: orderDetails.subtotal,
//         tax: orderDetails.tax,
//         shippingCost: orderDetails.shippingCost,
//         totalPrice: orderDetails.totalAmount,
//         shippingAddress: orderDetails.shippingAddress
//       }
//     }),
//   });
// };

// export const sendVendorNotificationEmail = async (vendor: any, order: any, vendorOrderItems: any[]) => {
//   // Add a null check for the vendor object
//   if (!vendor || !vendor.shopName) {
//     console.error('Vendor or shopName is undefined:', vendor);
//     return; // or throw an error if you prefer
//   }

//   const { shopName } = vendor;
//   await resend.emails.send({
//     from: 'Vendorspot Orders <orders@vendorspot.ng>',
//     to: vendor.email,
//     subject: 'New Order Received',
//     react: VendorNotificationEmail({
//       vendorName: vendor.firstname,
//       shopName: shopName,
//       orderId: order.id,
//       orderDate: order.createdAt,
//       orderItems: vendorOrderItems,
//       subtotal: vendorOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//       tax: order.tax * (vendorOrderItems.length / order.orderItems.length), // Approximate tax allocation
//       shippingCost: order.shippingCost * (vendorOrderItems.length / order.orderItems.length), // Approximate shipping cost allocation
//       total: vendorOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
//         (order.tax + order.shippingCost) * (vendorOrderItems.length / order.orderItems.length),
//     }),
//   });
// };

import { EmailTemplateProps, generateEmailHTML } from '@component/verification-email';
import nodemailer from 'nodemailer';

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_MAIL_HOST!,
  port: parseInt(process.env.NEXT_PUBLIC_MAIL_PORT! || '587'),
  secure: process.env.NEXT_PUBLIC_MAIL_SECURE! === 'true',
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL_USERNAME!,
    pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD!,
  },
});

// Determine the domain based on the environment
const domain = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_FRONTEND_PROD_URL
  : process.env.NEXT_PUBLIC_FRONTEND_DEV_URL;

// Function to send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verification?token=${token}`;
  const emailProps: EmailTemplateProps = {
    logoUrl: `${domain}/logo.png`, // Adjust this to your actual logo URL
    emailHeading: 'Verify Your Email Address',
    emailBody: `<p>Please click the link below to verify your email address:</p><p><a href="${confirmationLink}">${confirmationLink}</a></p>`,
    currentYear: new Date().getFullYear(),
    privacyPolicyUrl: `${domain}/privacy`,
    termsOfServiceUrl: `${domain}/terms`,
  };

  await transporter.sendMail({
    from: '"Vendorspot Notification" <admin@vendorspot.ng>',
    to: email,
    subject: 'Verify your email address',
    html: generateEmailHTML(emailProps),
  });
};

// Function to send reset password email
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  const emailProps: EmailTemplateProps = {
    logoUrl: `${domain}/logo.png`,
    emailHeading: 'Reset Your Password',
    emailBody: `<p>Please click the button below to reset your password:</p>`,
    callToAction: {
      url: resetLink,
      text: 'Reset Password'
    },
    currentYear: new Date().getFullYear(),
    privacyPolicyUrl: `${domain}/privacy`,
    termsOfServiceUrl: `${domain}/terms`,
  };

  await transporter.sendMail({
    from: '"Vendorspot" <admin@vendorspot.ng>',
    to: email,
    subject: 'Reset Password',
    html: generateEmailHTML(emailProps),
  });
};

export const sendOrderConfirmationEmail = async (email: string,
  orderDetails: {
    orderId: string;
    items: any[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    totalAmount: number;
    shippingAddress: any;
  }) => {
  const itemsList = orderDetails.items.map(item =>
    `<li>${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}</li>`
  ).join('');

  const emailProps: EmailTemplateProps = {
    logoUrl: `${domain}/logo.png`,
    emailHeading: 'Order Confirmation',
    emailBody: `
      <p>Thank you for your order. Here are the details:</p>
      <p>Order ID: ${orderDetails.orderId}</p>
      <h3>Items:</h3>
      <ul>${itemsList}</ul>
      <p>Subtotal: $${orderDetails.subtotal.toFixed(2)}</p>
      <p>Tax: $${orderDetails.tax.toFixed(2)}</p>
      <p>Shipping Cost: $${orderDetails.shippingCost.toFixed(2)}</p>
      <p>Total Amount: $${orderDetails.totalAmount.toFixed(2)}</p>
      <h3>Shipping Address:</h3>
      <p>${orderDetails.shippingAddress.street}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}</p>
    `,
    callToAction: {
      url: `${domain}/orders/${orderDetails.orderId}`,
      text: 'View Order'
    },
    currentYear: new Date().getFullYear(),
    privacyPolicyUrl: `${domain}/privacy`,
    termsOfServiceUrl: `${domain}/terms`,
  };

  await transporter.sendMail({
    from: '"Vendorspot Orders" <orders@vendorspot.ng>',
    to: email,
    subject: 'Order Confirmation',
    html: generateEmailHTML(emailProps),
  });
};

export const sendVendorNotificationEmail = async (vendor: any, order: any, vendorOrderItems: any[]) => {
  if (!vendor || !vendor.shopName) {
    console.error('Vendor or shopName is undefined:', vendor);
    return;
  }

  const { shopName } = vendor;
  const itemsList = vendorOrderItems.map(item =>
    `<li>${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}</li>`
  ).join('');

  const subtotal = vendorOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = order.tax * (vendorOrderItems.length / order.orderItems.length);
  const shippingCost = order.shippingCost * (vendorOrderItems.length / order.orderItems.length);
  const total = subtotal + tax + shippingCost;

  const emailProps: EmailTemplateProps = {
    logoUrl: `${domain}/logo.png`,
    emailHeading: 'New Order Received',
    emailBody: `
      <p>Hello ${vendor.firstname},</p>
      <p>You have received a new order for your shop ${shopName}.</p>
      <p>Order ID: ${order.id}</p>
      <p>Order Date: ${order.createdAt.toLocaleString()}</p>
      <h3>Order Items:</h3>
      <ul>${itemsList}</ul>
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Tax: $${tax.toFixed(2)}</p>
      <p>Shipping Cost: $${shippingCost.toFixed(2)}</p>
      <p>Total: $${total.toFixed(2)}</p>
    `,
    callToAction: {
      url: `${domain}/vendor/orders/${order.id}`,
      text: 'View Order Details'
    },
    currentYear: new Date().getFullYear(),
    privacyPolicyUrl: `${domain}/privacy`,
    termsOfServiceUrl: `${domain}/terms`,
  };

  await transporter.sendMail({
    from: '"Vendorspot Orders" <orders@vendorspot.ng>',
    to: vendor.email,
    subject: 'New Order Received',
    html: generateEmailHTML(emailProps),
  });
};