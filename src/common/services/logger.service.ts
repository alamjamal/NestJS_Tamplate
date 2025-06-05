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

import DailyRotateFile = require('winston-daily-rotate-file');

@Injectable({
    scope: Scope.TRANSIENT
})
export class LoggerService<TLog extends ApplicationLogInterface> {
    private readonly nodeEnv: string;
    private context: string;
    private logger: InternalLoggerType;
    constructor(readonly configService: ConfigService) {
        this.nodeEnv = this.configService.get<NodeEnv>('NODE_ENV') ?? NodeEnv.Development;
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
        // if (this.nodeEnv === NodeEnv.Development.toString() || this.nodeEnv === NodeEnv.Local.toString()) {
        //     // Console logger for development
        //     this.logger = new ConsoleLogger({
        //         timestamp: true,
        //         context: this.context,
        //         logLevels: ['log', 'error', 'warn', 'debug']
        //     }) as InternalLoggerType;
        // } else {
        //     this.logger = craeteWinstonLogger(LoggerService.getWinstonLoggerOptions(this.context));
        // }
        this.logger = craeteWinstonLogger(LoggerService.getWinstonLoggerOptions());

        return this.logger;
    }

    private static getWinstonLoggerOptions(): winstonLoggerOption {
        const { combine, timestamp, errors, json, label, colorize } = format;

        return {
            transports: [
                new winstonTransports.Console({
                    level: 'info',
                    handleExceptions: true,
                    handleRejections: true,
                    format: combine(
                        colorize(),

                        timestamp(),
                        errors({ stack: true }),
                        json()
                    )
                }),
                new DailyRotateFile({
                    level: 'info',
                    filename: 'info-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxSize: '20m',
                    maxFiles: '30d',
                    dirname: 'logs',
                    format: combine(timestamp(), errors({ stack: true }), json())
                }),
                new DailyRotateFile({
                    level: 'error',
                    filename: 'error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxSize: '20m',
                    maxFiles: '30d',
                    dirname: 'logs',
                    format: combine(timestamp(), errors({ stack: true }), json())
                })
            ]
        };
    }
    log(log: string | TLog, time?: number): void {
        const logger = this.getLogger();
        const context = this.getContext();
        // if (typeof log === 'string') {
        //     // logger.log(log, { context });
        //     logger.log({ level: 'info', message: log, context });
        // } else {
        //     logger.log({ level: 'info', message: JSON.stringify(log), context });
        //     console.log('i am in obj');
        // }
        logger.log({ level: 'info', message: JSON.stringify(log), context, excutionTime: time });
    }
    error(log: string | TLog, stack?: string): void {
        const logger = this.getLogger();
        const safeStack = typeof stack === 'string' ? stack : '';
        if (typeof log === 'string') {
            logger.error(log, safeStack);
        } else {
            logger.error(JSON.stringify(log), safeStack);
        }
    }
    warn(log: string | TLog): void {
        const logger = this.getLogger();
        const context = this.context || 'LoggerServiceWarn';
        if (typeof log === 'string') {
            logger.warn(log, context);
        } else {
            logger.warn(JSON.stringify(log));
        }
    }
}
