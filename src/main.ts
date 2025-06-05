import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from './options/corsOptions';
import setupSwagger from './options/swaggerOptions';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NotFoundInterceptor } from './common/interceptors/not-found.interceptor';
import { FormatErrorPipe } from './common/pipes/format-error.pipe';
// import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { helmetOption } from './options/helmetOptions';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Request, Response } from 'express';
import { webCsrfCombinedMiddleware } from './common/middleware/webCsrf.middleware';
import { INestApplication } from '@nestjs/common';
import { LoggerService } from './common/services/logger.service';
import { ApplicationLogInterface } from './common/interface/application.log.interface';
import { LoggerInterceptor } from './common/interceptors/logger-interceptor';

async function setupLogger(app: INestApplication): Promise<void> {
    const logger: LoggerService<ApplicationLogInterface> = await app.resolve(LoggerService);
    const loggerInterceptor: LoggerInterceptor = await app.resolve(LoggerInterceptor);
    app.useLogger(logger);
    app.useGlobalInterceptors(loggerInterceptor);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log']
    });
    app.use(helmet(helmetOption));
    app.use(cookieParser('your-secret-key'));
    app.enableCors(corsOptions);
    app.enableShutdownHooks();
    // app.setGlobalPrefix('api/v1');

    app.use(webCsrfCombinedMiddleware);

    app.useGlobalPipes(new FormatErrorPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new NotFoundInterceptor());

    setupSwagger(app);
    await setupLogger(app);
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0', () => {
        console.info(`Application is running on: ${port}`);
    });
}

bootstrap()
    .then(() => {
        console.info('Nest application started: ', process.env.NODE_ENV);
    })
    .catch((error) => {
        console.info('Nest application failed to start', error);
    });
