// src/common/interceptors/not-found.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            tap((data: string | number | []) => {
                if (data === null || data === 0 || (Array.isArray(data) && data.length === 0)) {
                    throw new NotFoundException('Resource Not Found.');
                }
            })
        );
    }
}
