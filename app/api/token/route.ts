import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Issues a short-lived JWT for the logged-in BetterAuth user.
 * The Express server verifies it with the same JWT_SECRET (verifyToken middleware)
 * and then loads the user + role from MongoDB.
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const token = jwt.sign({ email: session.user.email }, process.env.JWT_SECRET as string, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
  return NextResponse.json({ token }, { headers: { 'Cache-Control': 'no-store' } });
}
