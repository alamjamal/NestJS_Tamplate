import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';
export const { doubleCsrfProtection, generateCsrfToken, validateRequest } = doubleCsrf({
    getSecret: (req: Request) => req?.secret || 'default-secret',
    getSessionIdentifier: (req: Request) => {
        // Use a unique identifier for the session, such as a user ID or session ID from cookies
        // Fallback to a static string if not available (not recommended for production)
        return req.cookies?.sessionId as string;
    },
    cookieName: 'csrf_token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    },
    getCsrfTokenFromRequest: (req: Request) => req.cookies['csrf_token'] as string,
    errorConfig: {
        statusCode: 403,
        message: 'Invalid CSRF Token',
        code: 'CSRF_TOKEN_INVALID'
    },
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'] // CSRF protection is not applied to these methods
});
