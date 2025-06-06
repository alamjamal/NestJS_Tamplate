// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    dsn: 'https://8d99d150f560c12cd0f055a58f086cb2@o4508319618760704.ingest.de.sentry.io/4509448079212624',

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
