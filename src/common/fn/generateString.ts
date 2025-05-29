import { randomBytes } from 'crypto';

export const generateString = (length: number): string => {
    // Generates a secure random string using base64url encoding
    return randomBytes(Math.ceil(length * 0.75))
        .toString('base64')
        .replace(/\+/g, 'A')
        .replace(/\//g, 'B')
        .replace(/=/g, '')
        .slice(0, length);
};
