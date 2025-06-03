import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { doubleCsrfProtection, generateCsrfToken } from '../../options/csrfOption';

function isMobile(req: Request) {
    const ua = req.headers['user-agent'] || '';
    return /android|iphone|ipad|mobile/i.test(ua);
}

export function webCsrfCombinedMiddleware(req: Request, res: Response, next: NextFunction) {
    if (isMobile(req)) return next();

    // Session ID logic
    if (!req.cookies?.sessionId) {
        res.cookie('sessionId', randomUUID(), {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
    }

    // CSRF token endpoint logic
    if (req.path === '/csrf-token' && req.method === 'GET') {
        const token = generateCsrfToken(req, res);
        return res.status(200).json({ csrfToken: token });
    }

    // CSRF protection for other routes
    doubleCsrfProtection(req, res, next);
}
