import { randomBytes } from 'crypto';

export function generateCertificateNumber(type: string): string {
  const prefix = type === 'PERSON' ? 'ISO27001-P' : 'ISO27001-C';
  const year = new Date().getFullYear();
  const random = randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export function computeExpiryDate(from: Date = new Date()): Date {
  const expiry = new Date(from);
  expiry.setFullYear(expiry.getFullYear() + 3);
  return expiry;
}

export function isExpired(expiryDate: Date): boolean {
  return expiryDate.getTime() < Date.now();
}
