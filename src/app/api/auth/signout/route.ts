// app/api/auth/signout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'auth';

export async function POST(req: NextRequest) {
    const session = await auth();

    if (session) {
        // Clear the session
        const response = NextResponse.json({ status: 'success' }, { status: 200 });

        // Clear the session cookies
        response.cookies.set('next-auth.session-token', '', {
            expires: new Date(0),
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax'
        });

        response.cookies.set('next-auth.csrf-token', '', {
            expires: new Date(0),
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax'
        });

        return response;
    }

    return NextResponse.json({ status: 'no session' }, { status: 200 });
}

// Optionally, handle other HTTP methods
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'Use POST method for signout' }, { status: 405 });
}