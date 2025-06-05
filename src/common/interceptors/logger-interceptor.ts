import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApplicationLogInterface } from '../interface/application.log.interface';
import { LogRequestType } from '../type/LogRequest';
import { AppController } from 'src/app.controller';
import DeviceDetector from 'node-device-detector';
import { LoggerService } from '../services/logger.service';
import { generateString } from '../fn/generateString';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    // private readonly deviceDetector = new DeviceDetector();
    constructor(private readonly loggerService: LoggerService<ApplicationLogInterface>) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler<unknown>
    ): Observable<unknown> | Promise<Observable<unknown>> {
        const request = context.switchToHttp().getRequest<LogRequestType>();
        // const response = context.switchToHttp().getResponse<Response>();
        const excutionClass = context.getClass().name;
        const excutionMethod = context.getHandler().name;
        // const requestId = request.headers['x-request-id'] || request.id || 'unknown-request-id';

        const log: ApplicationLogInterface = {
            requestId: request.cookies?.sessionId as string,
            message: `Request to ${excutionClass} ${excutionMethod} `,
            controller: excutionClass,
            method: excutionMethod,
            url: request.url,
            query: request.query,
            body: request.body as Record<string, unknown>,
            params: request.params,
            timestamp: new Date().toISOString()
        };

        request.benchmark = { startTime: performance.now() };
        if (request.user) {
            log.userId = request.user.uid;
            log.role = request.user.role;
        }
        if (request.headers['user-agent']) {
            log.clientDetails = {
                // ...this.deviceDetector.detect(request.headers['user-agent']),
                ip: request.headers['x-forwarded-for'] || request.ip
            };
        }

        return next.handle().pipe(
            tap(() => {
                request.benchmark.endTime = performance.now();
                log.responseTime = request.benchmark.endTime - request.benchmark.startTime;
                if (context.getClass() !== AppController) {
                    // console.log('logger interceptor', log);
                    this.loggerService.log(log);
                }
            })
        );
    }
}
