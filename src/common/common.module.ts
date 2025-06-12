import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './services/logger.service';
import { LoggerInterceptor } from './interceptors/logger-interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [LoggerService, LoggerInterceptor, HttpExceptionFilter],
    exports: [LoggerService, LoggerInterceptor, HttpExceptionFilter]
})
export class CommonModule {}
// This module is intentionally left empty for now, but can be expanded in the future
