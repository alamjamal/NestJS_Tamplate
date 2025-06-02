import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from './options/corsOptions';
import setupSwagger from './options/swaggerOptions';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NotFoundInterceptor } from './common/interceptors/not-found.interceptor';
import { FormatErrorPipe } from './common/pipes/format-error.pipe';
// import { CustomValidationPipe } from './common/pipes/validation.pipe';
// import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log']
    });

    app.use(cookieParser('your-secret-key'));
    app.enableCors(corsOptions);
    app.enableShutdownHooks();
    // app.setGlobalPrefix('api/v1');

    // Middleware to ensure every user has a unique sessionId cookie
    app.use((req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        if (!req.cookies?.sessionId) {
            res.cookie('sessionId', randomUUID(), {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                path: '/'
            });
        }
        next();
        console.log(`Session middleware took ${Date.now() - start}ms`);
    });

    // CSRF Protection
    const { doubleCsrfProtection, invalidCsrfTokenError, generateCsrfToken } = doubleCsrf({
        getSecret: (req: Request) => req?.secret || 'default-secret',
        getSessionIdentifier: (req: Request) => {
            // Use a unique identifier for the session, such as a user ID or session ID from cookies
            // Fallback to a static string if not available (not recommended for production)
            return req.cookies?.sessionId as string;
        },
        cookieName: '__Host-ps_csrf_token',
        cookieOptions: {
            sameSite: 'strict',
            path: '/',
            secure: true // Set to true if using HTTPS
        },
        getCsrfTokenFromRequest: (req: Request) => req.headers['x-csrf-token'],
        errorConfig: {
            statusCode: 403,
            message: 'Invalid CSRF Token',
            code: 'CSRF_TOKEN_INVALID'
        },
        ignoredMethods: ['GET', 'HEAD', 'OPTIONS'] // CSRF protection is not applied to these methods
    });

    // Apply CSRF protection to all POST, PUT, PATCH, DELETE requests
    app.use(doubleCsrfProtection);

    app.use('/csrf-token', (req: Request, res: Response) => {
        const token = generateCsrfToken(req, res);
        res.status(200).json({ csrfToken: token });
    });

    app.useGlobalPipes(new FormatErrorPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new NotFoundInterceptor());

    setupSwagger(app);

    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0', () => {
        console.log(`Application is running on: ${port}`);
    });
}

bootstrap()
    .then(() => {
        console.log('Nest application started');
    })
    .catch((err) => {
        console.error('Nest application failed to start', err);
    });
