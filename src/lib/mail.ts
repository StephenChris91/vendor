import { Resend } from 'resend';

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
