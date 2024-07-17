import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/data/user';
import { generateVerificationToken } from '@/lib/data/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {

    const { email, password } = await request.json();

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return NextResponse.json({ error: 'This user does not exist!' }, { status: 404 });
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(existingUser.email);

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return NextResponse.json({ success: 'Confirmation email sent' });
    }

    const vendorOnboard = existingUser.role === 'Vendor' && existingUser.isOnboardedVendor;
    const vendorNotOnboarded = existingUser.role === 'Vendor' && !existingUser.isOnboardedVendor;

    await signIn('credentials', {
      email,
      password,
      redirectTo: vendorOnboard ? '/dashboard' : vendorNotOnboarded ? '/auth/onboarding' : '/auth/profile'
    });

    return NextResponse.json({ success: 'Logged in successfully' });

  } catch (error) {
    console.error("Error during login:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return NextResponse.json({ error: 'Your credentials are incorrect!' }, { status: 401 });
        default:
          return NextResponse.json({ error: 'Something Went Wrong!' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
