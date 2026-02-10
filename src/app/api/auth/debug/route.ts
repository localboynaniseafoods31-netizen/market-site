import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasAuthSecret: !!process.env.AUTH_SECRET,
        authSecretLength: process.env.AUTH_SECRET?.length || 0,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        nodeEnv: process.env.NODE_ENV,
        authUrl: process.env.AUTH_URL || 'not set',
        nextauthUrl: process.env.NEXTAUTH_URL || 'not set',
        authTrustHost: process.env.AUTH_TRUST_HOST || 'not set',
        vercel: process.env.VERCEL || 'not set',
    });
}
