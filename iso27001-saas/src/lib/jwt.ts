import { SignJWT, jwtVerify } from 'jose';

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  accountType: 'PERSON' | 'COMPANY';
};

const SESSION_COOKIE = 'iso27001_session';
const SESSION_TTL = '7d';

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET manquant - définissez-le dans .env');
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
