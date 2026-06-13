import crypto from 'crypto';

const SECRET = process.env.ADMIN_SECRET ?? 'eq-admin-secret-change-in-production';

export function generateAdminToken(): string {
  return crypto.createHmac('sha256', SECRET).update('admin-session-v1').digest('hex');
}

export function verifyAdminToken(token: string): boolean {
  const expected = generateAdminToken();
  try {
    return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = 'eq_admin_token';
