import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ApplicationLogInterface } from '../interface/application.log.interface';
import { InternalLoggerType } from '../type/LoggerInternal';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from '../enums/NodeEnv';
import {
    createLogger as craeteWinstonLogger,
    transports as winstonTransports,
    format,
    LoggerOptions as winstonLoggerOption
} from 'winston';
import { createStream } from 'rotating-file-stream';
import * as Sentry from '@sentry/nestjs';
import { logger as sentryLogger } from '@sentry/nestjs';
import Transport from 'winston-transport';
// const SentryWinstonTransport = Sentry.createSentryWinstonTransport(Transport);

const logOptions = {
    interval: '1d', // rotate daily
    path: 'logs',
    // filename: 'application-%DATE%.log', // log file name pattern
    size: '50K', // maximum file size
    maxFiles: 5 // maximum number of files to keep,
};
const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => `[${timestamp as string}] ${level}: ${message as string}`),
    format.timestamp({
        format: 'DD-MM-YYYY hh:mm:ss a', // Custom timestamp format,
        alias: 'timestamp' // Alias for the timestamp field
    }),
    format.json(),
    format.errors({ stack: true }), // Include stack trace for errors
    format.colorize(), // Colorize the output for better readability
    format.splat(), // Allow for string interpolation
    format.metadata() // Include metadata in the log
);

@Injectable({
    scope: Scope.TRANSIENT
})
export class LoggerService<TLog extends ApplicationLogInterface> {
    private readonly nodeEnv: string;
    private context: string;
    private logger: InternalLoggerType;
    constructor(readonly configService: ConfigService) {
        this.nodeEnv = this.configService.get<NodeEnv>('NODE_ENV') ?? NodeEnv.Development;
        this.getLogger();
    }

    setContext(context: string): void {
        this.context = context;
    }
    getContext(): string {
        return this.context;
    }
    getLogger(): InternalLoggerType {
        if (this.logger) {
            return this.logger;
        }
        if (this.nodeEnv === NodeEnv.Development.toString() || this.nodeEnv === NodeEnv.Local.toString()) {
            // Console logger for development
            this.logger = new ConsoleLogger({
                timestamp: true,
                context: this.context,
                logLevels: ['log', 'error', 'warn', 'debug']
            }) as InternalLoggerType;
        } else {
            this.logger = craeteWinstonLogger({
                format: logFormat,
                transports: [
                    new winstonTransports.Stream({
                        stream: createStream('info.log', logOptions)
                    })

                    // new SentryWinstonTransport()
                ]
            });
        }

        return this.logger;
    }

    log(log: string | TLog, message?: string, context?: string): void {
        const ctx = context || this.context;
        const msg = message ? message : typeof log === 'string' ? log : log.message;
        setImmediate(() => {
            this.logger.log({
                level: 'info',
                message: msg,
                log: log,
                ...{ ctx }
            });
            sentryLogger.info('info', { message: msg, log, ctx });
        });
    }
    error(log: string | TLog, stack?: string | TLog, message?: string, context?: string): void {
        const ctx = context || this.context;
        const msg = message ? message : typeof log === 'string' ? log : log.message;

        setImmediate(() => {
            this.logger.error({
                level: 'error',
                log: log,
                message: msg,
                stack,
                ...{ ctx }
            });
            sentryLogger.error('error', { log, ctx, stack });
        });
    }
    warn(log: string | TLog, message?: string, context?: string): void {
        const ctx = context || this.context;
        const msg = message ? message : typeof log === 'string' ? log : log.message;

        setImmediate(() => {
            this.logger.warn({
                level: 'warn',
                message: msg,
                log: log,
                ...{ ctx }
            });
            sentryLogger.warn('warn', { message: msg, log, ctx });
        });
    }
}
