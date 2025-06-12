// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as dotenv from 'dotenv';
dotenv.config();
Sentry.init({
    dsn: process.env.NODE_ENV == 'production' ? process.env.SENTRY_DSN : '',
    beforeSend(event) {
        event.extra = {
            ...event.extra,
            localTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };
        return event;
    },

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    integrations: [
        nodeProfilingIntegration(),
        Sentry.nestIntegration(),
        Sentry.postgresIntegration(),
        Sentry.onUnhandledRejectionIntegration(),
        Sentry.onUncaughtExceptionIntegration(),
        Sentry.consoleLoggingIntegration()
    ],

    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is evaluated only once per SDK.init call
    profileSessionSampleRate: 1.0,
    // Trace lifecycle automatically enables profiling during active traces
    profileLifecycle: 'trace',

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,

    _experiments: {
        enableLogs: true
    }
});

Sentry.startSpan(
    {
        name: 'My Span'
    },
    () => {
        // The code executed here will be profiled
    }
);
