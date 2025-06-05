// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';

Sentry.init({
    dsn: 'https://8d99d150f560c12cd0f055a58f086cb2@o4508319618760704.ingest.de.sentry.io/4509448079212624',

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    _experiments: {
        enableLogs: true
    }
});
