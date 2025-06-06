import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './services/logger.service';
import { LoggerInterceptor } from './interceptors/logger-interceptor';

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [LoggerService, LoggerInterceptor],
    exports: [LoggerService, LoggerInterceptor]
})
export class CommonModule {}
// This module is intentionally left empty for now, but can be expanded in the future
