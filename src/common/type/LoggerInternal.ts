import { ConsoleLogger } from '@nestjs/common';
import { LeveledLogMethod, Logger as WinstonLogger } from 'winston';
export type InternalLoggerType = (WinstonLogger | ConsoleLogger) & {
    log: ((message: string, context?: string) => void) | LeveledLogMethod;
};
